using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Repo_Pattern_MVC.Utility
{
	public static class Extension
	{
		public static string NullToString(this string value)
		{
			if (string.IsNullOrWhiteSpace(value))
				return string.Empty;
			else
				return value.Trim();
		}
		public static string EmptyFiledGroup(this string value)
		{
			if (string.IsNullOrWhiteSpace(value))
				return "text";
			else
				return value.Trim();
		}
		public static string GuidToString(this System.Guid? value)
		{
			System.Guid obj = new System.Guid();
			if (value == null)
				return obj.ToString();
			else
				return value.ToString();
		}
		public static string GuidToString(this System.Guid value)
		{
			System.Guid obj = new System.Guid();
			if (value == null)
				return obj.ToString();
			else
				return value.ToString();
		}

		public static int NullToInt(this int? value)
		{
			if (value == null)
				return 0;
			else
				return value.Value;
		}

		public static string FormatRap(this decimal? value)
		{
			if (value == null)
				return "0";
			else
				return value.Value.ToString("#####");
		}

		public static decimal NullToDecimal(this decimal? value)
		{
			if (value == null)
				return 0;
			else
				return value.Value;
		}

		public static string NumberToCurrency(this decimal value)
		{
			return String.Format("{0:###,##0.00}", value);
		}

		public static string DateToString(this DateTime? value)
		{
			if (value != null)
			{
				return value.Value.ToString("dd/MM/yyyy");
			}
			else
				return string.Empty;
		}

		public static string NullDateToString(this DateTime value)
		{
			if (value != null)
			{
				return value.ToString();
			}
			else
				return string.Empty;
		}


		//public static string TranslateLanguage(this string value)
		//{
		//	if (value != null)
		//	{
		//		if (SessionFacade.SiteLanguage == "Eng")
		//		{
		//			value = Repo_Pattern_MVC_Web.App_LocalResources.Resources.About_us;
		//		}
		//		else if (SessionFacade.SiteLanguage == "Chinese")
		//		{
		//			value = Repo_Pattern_MVC_Web.App_LocalResources.Chinese.About_us;
		//		}
		//	}

		//	return value;
		//}
	}
}