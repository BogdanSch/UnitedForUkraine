using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class ReceiptRepository(ApplicationDbContext context) : IReceiptRepository
{
    public const string ISSUER_NAME = "United For Ukraine Foundation";
    public const string ISSUER_EMAIL = "ufu@host.com";
    private readonly ApplicationDbContext _context = context;
    public async Task<Receipt?> GetByIdAsync(int id) => await _context.Receipts.FirstOrDefaultAsync(n => n.Id == id);
    public async Task<Receipt?> GetByDonationIdAsync(int donationId) => await _context.Receipts.FirstOrDefaultAsync(n => n.DonationId == donationId);
    public async Task AddAsync(Receipt receipt)
    {
        receipt.IssuerName = ISSUER_NAME;
        receipt.IssuerEmail = ISSUER_EMAIL;
        await _context.Receipts.AddAsync(receipt);
        await SaveAsync();

        receipt.ReceiptNumber = $"UFU-{receipt.Id:D6}";
        await SaveAsync();
    }
    public async Task<bool> DeleteByIdAsync(int id)
    {
        Receipt? receipt = await GetByIdAsync(id);
        if (receipt is null)
            return false;

        _context.Receipts.Remove(receipt);
        return await SaveAsync();
    }
    public async Task<bool> UpdateAsync(Receipt receipt)
    {
        _context.Receipts.Update(receipt);
        return await SaveAsync();
    }
    public async Task<bool> SaveAsync()
    {
        int saved = await _context.SaveChangesAsync();
        return saved > 0;
    }
    public async Task<bool> ExistsForDonationAsync(int donationId)
    {
        return await _context.Receipts.Where(r => r.DonationId == donationId).AnyAsync();
    }
}
