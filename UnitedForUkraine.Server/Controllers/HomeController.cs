using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;
public class HomeController : Controller
{

    public IActionResult Index()
    {
        List<Donation> donations = new List<Donation>();

        return View();
    }
}
