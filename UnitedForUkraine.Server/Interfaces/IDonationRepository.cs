using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IDonationRepository
{
    Task<IEnumerable<Donation>> GetAllDonations();
    Task<IEnumerable<Donation>> GetDonations(int donationsAmount);
    Task<Donation> GetDonationById(int id);
    decimal GetTotalDonationsAmount();
    Task<int> GetTotalDonationsCount();
    Task<int> GetAverageDonationsAmount();
    Task<int> GetUniqueDonorsCount();
    Task<Donation> Add(Donation donation);
    Task<Donation> Delete(int id);
    bool Update(Donation donation);
    bool Save();
}
