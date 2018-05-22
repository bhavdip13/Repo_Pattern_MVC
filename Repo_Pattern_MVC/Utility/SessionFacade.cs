using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Repo_Pattern_MVC.Utility
{
	public static class SessionFacade
	{


		#region Public Properties

		//public static SL_Cust_Web_MstGetLogin_Result UserSession
		//{
		//	get
		//	{
		//		SL_Cust_Web_MstGetLogin_Result userAuth
		//						 = (SL_Cust_Web_MstGetLogin_Result)HttpContext.Current.Session[LoggedInUser];
		//		return userAuth;
		//	}

		//	set
		//	{
		//		HttpContext.Current.Session[LoggedInUser] = value;
		//	}
		//}

		//public static string SearchQuery
		//{
		//	get
		//	{
		//		return HttpContext.Current.Session[SearchString].ToString();
		//	}
		//	set
		//	{
		//		HttpContext.Current.Session[SearchString] = value;
		//	}
		//}



		//public static Search_Filter SearchParameters
		//{
		//	get
		//	{
		//		Search_Filter objDiamondAttributes
		//						 = (Search_Filter)HttpContext.Current.Session[SearchAttributes];
		//		return objDiamondAttributes;
		//	}

		//	set
		//	{
		//		HttpContext.Current.Session[SearchAttributes] = value;
		//	}
		//}

		//OrderCalculation
		//public static OrderCalculation OrderDetail
		//{
		//	get
		//	{
		//		OrderCalculation objOrder_Calculation
		//						 = (OrderCalculation)HttpContext.Current.Session[OrderCalculation];
		//		return objOrder_Calculation;
		//	}

		//	set
		//	{
		//		HttpContext.Current.Session[OrderCalculation] = value;
		//	}
		//}


		//public static List<spname_Result> SearchResultStoneList
		//{
		//	get
		//	{
		//		List<Web_SL_Packet_Master_SearchStock_Result> list
		//						 = (List<spname_Result>)HttpContext.Current.Session[SearchResultStone];
		//		return list;
		//	}

		//	set
		//	{
		//		HttpContext.Current.Session[SearchResultStone] = value;
		//	}
		//}

		//public static string SiteLanguage
		//{
		//	get
		//	{
		//		if (HttpContext.Current.Session == null || HttpContext.Current.Session[_SiteLanguage] == null)
		//			return string.Empty;
		//		else
		//			return HttpContext.Current.Session[_SiteLanguage].ToString();
		//	}
		//	set
		//	{
		//		HttpContext.Current.Session[_SiteLanguage] = value;
		//	}
		//}
		//#endregion

		//public static string Lenguage1
		//{
		//	get
		//	{
		//		return HttpContext.Current.Session[Lenguage].ToString();
		//	}
		//	set
		//	{
		//		HttpContext.Current.Session[Lenguage] = value;
		//	}
		//}
		#endregion
	}
}

//how to use sesseionfacad in controller
//[SessionExpireFilterAttribute]
//public ActionResult MyProfile()
//{
//	return view();
//}
