using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Repo_Pattern_MVC.Utility;
using Repo_Pattern_MVC_Model;
using Repo_Pattern_MVC_Model.Model;
using Repo_pattern_MVC_Repository.Service;
using Repo_pattern_MVC_Repository.ServiceContract;

namespace Repo_Pattern_MVC.Controllers
{
	public class HomeController : Controller
	{
		IHome_Repository _Home_Repository = new Home_Repository(new Repo_Pattern_MVCEntities());
		public ActionResult Index()
		{
			
			return View();
		}
		[HttpGet]
		public JsonResult GetCountry()
		{
			return Json(new { country = _Home_Repository.GetCountry() }, JsonRequestBehavior.AllowGet);
		}
		[HttpGet]
		public JsonResult GetState(int CountryId)
		{
			return Json(new { states = _Home_Repository.GetState(CountryId) }, JsonRequestBehavior.AllowGet);
		}
		[HttpGet]
		public JsonResult GetCity(int stateId)
		{
			
			var jsonResult = Json(new { city = _Home_Repository.GetCity(stateId) }, JsonRequestBehavior.AllowGet);
			jsonResult.MaxJsonLength = int.MaxValue;
			return jsonResult;

		}
		[HttpPost]
		public JsonResult CheckEmailAlredyregister(string Email)
		{
			var IS_registerd = _Home_Repository.CheckEmailAlredyregister(Email);
			return  Json(new { IS_registerd }, JsonRequestBehavior.AllowGet);
		}
		[HttpPost]
		public JsonResult Register(Register _Model)
		{
			var result = new jsonMessage();
			try
			{
				int Issave=_Home_Repository.Register(_Model);
				if(Issave==1)
				{
					result.Message = "Your Registration Successfully Please Check Your email..";
					result.Status = true;
				}
				
			}
			catch (Exception ex)
			{
				//ErrorLogers.ErrorLog(ex);
				result.Message = ex.ToString();
				result.Status = false;
			}
			return Json(result, JsonRequestBehavior.AllowGet);
		}
		public ActionResult About()
		{
			ViewBag.Message = "Your application description page.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "Your contact page.";

			return View();
		}
	}
}