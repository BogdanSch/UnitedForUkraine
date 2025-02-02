using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IDonationRepository
{
    Task<IEnumerable<Donation>> GetAllDonations();
    Task<IEnumerable<Donation>> GetDonations(int donationsAmount);
    Task<Donation> GetDonation(int id);
    Task<Donation> AddDonation(Donation donation);
    bool UpdateDonation(Donation donation);
    Task<Donation> DeleteDonation(int id);
}
