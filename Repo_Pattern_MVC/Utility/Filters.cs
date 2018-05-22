using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Repo_Pattern_MVC.Utility
{
	public class SessionExpireFilterAttribute : ActionFilterAttribute
	{
		//public override void OnActionExecuting(ActionExecutingContext filterContext)
		//{
		//	HttpContext ctx = HttpContext.Current;

		//	if (filterContext.HttpContext.Request.IsAjaxRequest())
		//	{
		//		if (SessionFacade.UserSession == null)
		//		{
		//			filterContext.HttpContext.Response.StatusCode = 401;
		//			filterContext.HttpContext.Response.End();
		//		}
		//	}
		//	else
		//	{
		//		if (SessionFacade.UserSession == null)
		//		{
		//			filterContext.Result = new RedirectResult("~/Home/Index");
		//			return;
		//		}
		//		//use when your website have multiple language.
		//		//if (SessionFacade.SiteLanguage != null)
		//		//{
		//		//	string fc = SessionFacade.SiteLanguage;
		//		//	if (!string.IsNullOrEmpty(fc))
		//		//	{
		//		//		if (fc == "Eng")
		//		//		{
		//		//			Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo("en-US");
		//		//		}
		//		//		else
		//		//		{
		//		//			Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo("zh-CN");
		//		//		}
		//		//	}
		//		//	else
		//		//	{
		//		//		Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo("en-US");
		//		//	}
		//		//}
		//	}
		//	base.OnActionExecuting(filterContext);
		//}
	}

	[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class,
									AllowMultiple = false, Inherited = true)]
	public sealed class ValidateJsonAntiForgeryTokenAttribute
															: FilterAttribute, IAuthorizationFilter
	{
		public void OnAuthorization(AuthorizationContext filterContext)
		{
			if (filterContext == null)
			{
				throw new ArgumentNullException("filterContext");
			}

			var httpContext = filterContext.HttpContext;
			var cookie = httpContext.Request.Cookies[AntiForgeryConfig.CookieName];
			AntiForgery.Validate(cookie != null ? cookie.Value : null,
													 httpContext.Request.Headers["__RequestVerificationToken"]);
		}
	}

}
