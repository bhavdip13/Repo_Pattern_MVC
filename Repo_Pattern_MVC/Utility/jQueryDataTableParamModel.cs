using Repo_Pattern_MVC.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Repo_Pattern_MVC.Utility
{
	public class jQueryDataTableParamModel
	{
		/// <summary>
		/// Request sequence number sent by DataTable,
		/// same value must be returned in response
		/// </summary>       
		public string sEcho { get; set; }

		/// <summary>
		/// Text used for filtering
		/// </summary>
		public string sSearch { get; set; }

		/// <summary>
		/// Number of records that should be shown in table
		/// </summary>
		public int iDisplayLength { get; set; }

		/// <summary>
		/// First record that should be shown(used for paging)
		/// </summary>
		public int iDisplayStart { get; set; }

		/// <summary>
		/// Number of columns in table
		/// </summary>
		public int iColumns { get; set; }

		/// <summary>
		/// Number of columns that are used in sorting
		/// </summary>
		public int iSortingCols { get; set; }

		/// <summary>
		/// Comma separated list of column names
		/// </summary>
		public string sColumns { get; set; }
		public string SearchParameter { get; set; }
		public string ReportType { get; set; }
		public string OutPutType { get; set; }
		public string DateFrom { get; set; }
		public string DateTo { get; set; }
		public string Clarity { get; set; }
		public string Color { get; set; }
		public string Party { get; set; }
		public int PartyID { get; set; }
		public string InvoiceDate { get; set; }
		public int FilterID { get; set; }
		public string StockFilter { get; set; }
		public string ReportPara { get; set; }
		public string OrderStatus { get; set; }
	}
}




