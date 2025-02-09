using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IDonationRepository
{
    Task<IEnumerable<Donation>> GetAllDonations();
    Task<IEnumerable<Donation>> GetDonations(int donationsAmount);
    Task<Donation> GetDonationById(int id);
    Task<Donation> Add(Donation donation);
    Task<Donation> Delete(int id);
    Task<bool> Update(Donation donation);
    Task<bool> Save();
}
