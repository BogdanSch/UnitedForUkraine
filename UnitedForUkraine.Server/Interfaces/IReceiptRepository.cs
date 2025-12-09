using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IReceiptRepository
{
    Task<Receipt?> GetByIdAsync(int id);
    Task AddAsync(Receipt receipt);
    Task<bool> DeleteByIdAsync(int id);
    Task<bool> UpdateAsync(Receipt receipt);
    Task<bool> SaveAsync();
    Task<bool> ExistsForDonationAsync(int donationId);
}
