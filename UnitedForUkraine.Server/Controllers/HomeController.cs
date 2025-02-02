using Microsoft.AspNetCore.Mvc;

namespace UnitedForUkraine.Server.Controllers;
public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
