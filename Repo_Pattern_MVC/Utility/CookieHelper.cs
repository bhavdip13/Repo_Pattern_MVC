using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Repo_Pattern_MVC.Utility
{
	public class CookieHelper
	{
		//public static string GetCookieValue(string cookieName)
		//{
		//    if (HttpContext.Current.Request.Cookies[cookieName] != null)
		//        return HttpContext.Current.Request.Cookies[cookieName].Value;
		//    else
		//        return string.Empty;
		//}
		public static NameValueCollection GetCookieValue(string cookieName)
		{
			if (HttpContext.Current.Request.Cookies[cookieName] != null)
				return HttpContext.Current.Request.Cookies[cookieName].Values;
			else
				return new NameValueCollection();
		}

		//public static void CreateCookie(string cookieName, string value, int? expirationDays)
		//{
		//    HttpCookie Cookie = new HttpCookie(cookieName, value);
		//    if (expirationDays.HasValue)
		//        Cookie.Expires = DateTime.Now.AddDays(expirationDays.Value);
		//    HttpContext.Current.Response.Cookies.Add(Cookie);
		//}
		public static void CreateCookie(string cookieName, Dictionary<string, string> keyValue, int? expirationDays)
		{
			HttpCookie Cookie = new HttpCookie(cookieName);

			foreach (KeyValuePair<string, string> val in keyValue)
			{
				Cookie[val.Key] = val.Value;
			}

			Cookie.Expires = DateTime.Now.AddDays(expirationDays.Value);
			HttpContext.Current.Response.Cookies.Add(Cookie);
		}

		public static void DeleteCookie(string cookieName)
		{
			HttpCookie Cookie = HttpContext.Current.Request.Cookies[cookieName];
			if (Cookie != null)
			{
				Cookie.Expires = DateTime.Now.AddDays(-2);
				HttpContext.Current.Response.Cookies.Add(Cookie);
			}
		}

		public static bool CookieExists(string cookieName)
		{
			bool exists = false;
			HttpCookie cookie = HttpContext.Current.Request.Cookies[cookieName];
			if (cookie != null)
				exists = true;
			return exists;
		}

		public static Dictionary<string, string> GetAllCookies()
		{
			Dictionary<string, string> cookies = new Dictionary<string, string>();
			foreach (string key in HttpContext.Current.Request.Cookies.AllKeys)
			{
				cookies.Add(key, HttpContext.Current.Request.Cookies[key].Value);
			}
			return cookies;
		}

		public static void DeleteAllCookies()
		{
			var x = HttpContext.Current.Request.Cookies;
			foreach (HttpCookie cook in x)
			{
				DeleteCookie(cook.Name);
			}
		}
	}

	public class CookieKey
	{
		public static string LoggedInUserId = "LoggedInUserId";
		public static string cookieUserName = "cookieUserName";
		public static string cookiePassword = "cookiePassword";

	}
}

//how to use in controller
//Dictionary<string, string> keyVal = new Dictionary<string, string>();
//keyVal.Add(CookieKey.cookieUserName, UserName);
//keyVal.Add(CookieKey.cookiePassword, Password);
//CookieHelper.CreateCookie(CookieKey.LoggedInUserId, keyVal, 30);
