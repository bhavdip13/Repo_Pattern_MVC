using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using OfficeOpenXml.Drawing;
using System.IO;
using System.Data;
using System.Data.OleDb;

namespace Repo_Pattern_MVC.Utility
{
	public class ImportExcelFile
	{

		public static DataTable GetExcelfiledata(string filePath)
		{
			string strcon = string.Empty;
			string StrFileType = Path.GetExtension(filePath);
			if (StrFileType == ".xls")
			{
				strcon = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source="
												+ filePath +
												";Extended Properties=\"Excel 8.0;HDR=YES;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";
			}
			else
			{
				strcon = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source="
											+ filePath +
											";Extended Properties=\"Excel 12.0;HDR=YES;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";
			}
			DataTable dtexcel = new DataTable();

			using (OleDbConnection excelCon = new OleDbConnection(strcon))
			{
				try
				{
					excelCon.Open();

					//Start::Get Sheet Name Dynamically
					DataTable dtSheetNames = excelCon.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
					if (dtSheetNames == null)
					{
						return null;
					}
					string strselect = "Select * from [" + dtSheetNames.Rows[0]["TABLE_NAME"] + "]";

					using (OleDbDataAdapter exDA = new OleDbDataAdapter(strselect, excelCon))
					{
						exDA.Fill(dtexcel);
					}
				}
				catch (OleDbException oledb)
				{
					throw new Exception(oledb.Message.ToString());
				}
				finally
				{
					excelCon.Close();
				}
			}

			return dtexcel;
		}

		//public static string CreateAndExport(System.Data.DataTable dtDiamonds, string stUsername, string party_id, bool isExportPopup)
		//{
		//    string stReturnFileName = "";
		//    string inputData = "";
		//    decimal inputValue = 0;
		//    try
		//    {
		//        using (ExcelPackage p = new ExcelPackage())
		//        {
		//            #region Company Detail on Header
		//            p.Workbook.Properties.Author = "Pansuriya Impex";
		//            p.Workbook.Properties.Title = "Pansuriya Impex - Proposed Stock";
		//            //Create a sheet
		//            p.Workbook.Worksheets.Add("Suggested Diamonds");
		//            //Excel Worksheet 2
		//            ExcelWorksheet worksheet2 = p.Workbook.Worksheets[1];
		//            worksheet2.Name = "Stock_List " + DateTime.Now.ToString("dd-MM-yyyy");
		//            worksheet2.Cells.Style.Font.Size = 10;
		//            worksheet2.Cells.Style.Font.Name = "Calibri";
		//            worksheet2.Cells[1, 3, 4, 12].Style.Font.Bold = true;
		//            worksheet2.Cells[1, 3].Value = "Pansuriya Impex PVT. LTD.";
		//            worksheet2.Cells[1, 3].Style.Font.Size = 18;
		//            worksheet2.Cells[1, 3].Style.Font.Bold = true;
		//            worksheet2.Cells[1, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[1, 3].Style.Font.Color.SetColor(System.Drawing.Color.DarkBlue);
		//            worksheet2.Cells[2, 3].Value = "GE 1050, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra(e), Mumbai-400051, India.";
		//            worksheet2.Cells[2, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[3, 3].Value = "Tel.: (91) 22-4046 4444, FAX: (91) 22- 4046 4445";
		//            worksheet2.Cells[3, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[4, 3].Value = "Email: net@pansuriyaimpex.com";
		//            worksheet2.Cells[4, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[5, 4].Value = "Price/ct = TotalAmt/Carat   TotalAmt = Price/Ct*Carat";
		//            worksheet2.Cells[5, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

		//            worksheet2.Cells[1, 3, 1, 12].Merge = true;
		//            worksheet2.Cells[2, 3, 2, 12].Merge = true;
		//            worksheet2.Cells[3, 3, 3, 12].Merge = true;
		//            worksheet2.Cells[4, 3, 4, 12].Merge = true;
		//            worksheet2.Cells[5, 3, 5, 12].Merge = true;

		//            worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count - 1].AutoFilter = true;
		//            worksheet2.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            #endregion

		//            #region Header Name Declaration
		//            worksheet2.Cells[6, 1].Value = "Stone Id";
		//            worksheet2.Cells[6, 2].Value = "Shape";
		//            worksheet2.Cells[6, 3].Value = "Color";
		//            worksheet2.Cells[6, 4].Value = "Clarity";
		//            worksheet2.Cells[6, 5].Value = "Cut";
		//            worksheet2.Cells[6, 6].Value = "Polish";
		//            worksheet2.Cells[6, 7].Value = "Symmetry";
		//            worksheet2.Cells[6, 8].Value = "Florosence";
		//            worksheet2.Cells[6, 9].Value = "Rap Price";
		//            worksheet2.Cells[6, 10].Value = "Discount";
		//            worksheet2.Cells[6, 11].Value = "Carat";
		//            worksheet2.Cells[6, 12].Value = "Amount";
		//            worksheet2.Cells[6, 13].Value = "Price/Carat";
		//            worksheet2.Cells[6, 14].Value = "Certificate No";

		//            worksheet2.Cells[6, 15].Value = "Lab";
		//            worksheet2.Cells[6, 16].Value = "Measurement";
		//            worksheet2.Cells[6, 17].Value = "Length";
		//            worksheet2.Cells[6, 18].Value = "Width";
		//            worksheet2.Cells[6, 19].Value = "Height";
		//            worksheet2.Cells[6, 20].Value = "Table";
		//            worksheet2.Cells[6, 21].Value = "Depth";
		//            worksheet2.Cells[6, 22].Value = "Cr Ang";
		//            worksheet2.Cells[6, 23].Value = "Cr Height";
		//            worksheet2.Cells[6, 24].Value = "Pav Ang";
		//            worksheet2.Cells[6, 25].Value = "Pav Height";
		//            worksheet2.Cells[6, 26].Value = "Gridle";
		//            worksheet2.Cells[6, 27].Value = "Girdle Thin";
		//            worksheet2.Cells[6, 28].Value = "Girdle Thick";
		//            worksheet2.Cells[6, 29].Value = "Culet";
		//            worksheet2.Cells[6, 30].Value = "Fancy Color";
		//            worksheet2.Cells[6, 31].Value = "Facny Color Intensity";
		//            worksheet2.Cells[6, 32].Value = "Facny Color Overtone";
		//            //worksheet2.Cells[6, 33].Value = "Shade";

		//            worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count].Style.Font.Bold = true;

		//            ////worksheet  2
		//            //ExcelStyle cellStyleHeaderwrks = worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count + 1].Style;
		//            ////cellStyleHeaderwrks.Border.Left.Style = cellStyleHeaderwrks.Border.Right.Style
		//            ////                                      = cellStyleHeaderwrks.Border.Top.Style = cellStyleHeaderwrks.Border.Bottom.Style
		//            ////                                      = ExcelBorderStyle.Medium;
		//            //cellStyleHeaderwrks.Font.Color.SetColor(Color.White);

		//            worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count - 1].Style.Font.Bold = true;
		//            worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count - 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
		//            worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count - 1].Style.Fill.BackgroundColor.SetColor(Color.DarkGray);
		//            worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count - 1].Style.Font.Color.SetColor(Color.White);

		//            //var cellBackgroundColorwrks = worksheet2.Cells[6, 1, 6, dtDiamonds.Columns.Count + 1].Style.Fill;
		//            //cellBackgroundColorwrks.PatternType = ExcelFillStyle.Solid;
		//            ////cellBackgroundColorwrks.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(0x57, 0xA3, 0xEB));
		//            //cellBackgroundColorwrks.BackgroundColor.SetColor(Color.DarkGray);

		//            #endregion

		//            int inStartIndex = 7;

		//            int inEndCounter = dtDiamonds.Rows.Count + inStartIndex;
		//            string stShape = string.Empty;


		//            #region Set AutoFit and Decimal Number Format
		//            //worksheet2.View.FreezePanes(7, 1);

		//            //worksheet2.Cells[7, 1].AutoFitColumns(12);


		//            #endregion

		//            worksheet2.Cells[inStartIndex, 9, inEndCounter, 13].Style.Numberformat.Format = "#,0.00";
		//            worksheet2.Cells[inStartIndex, 17, inEndCounter, 25].Style.Numberformat.Format = "#,0.00";

		//            var namedStyle = p.Workbook.Styles.CreateNamedStyle("HyperLink");
		//            namedStyle.Style.Font.UnderLine = true;
		//            namedStyle.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
		//            namedStyle.Style.Font.Size = 10;
		//            namedStyle.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            namedStyle.Style.Font.Name = "Calibri";

		//            int colCount = dtDiamonds.Columns.Count;
		//            for (int j = 1; j <= colCount; j++)
		//            {
		//                worksheet2.Cells[7, j].AutoFitColumns();
		//            }

		//            for (int i = inStartIndex; i < inEndCounter; i++)
		//            {
		//                for (int j = 0; j < colCount - 1; j++)
		//                {
		//                    if ((j > 15 && j < 26) || (j >= 30 && j <= 31))
		//                    {
		//                        if (decimal.TryParse(dtDiamonds.Rows[i - inStartIndex][j].ToString(), out inputValue))
		//                        {
		//                            if (inputValue == 0)
		//                                worksheet2.Cells[i, j + 1].Value = "";
		//                            else
		//                                worksheet2.Cells[i, j + 1].Value = dtDiamonds.Rows[i - inStartIndex][j];
		//                        }
		//                        else
		//                        {
		//                            worksheet2.Cells[i, j + 1].Value = dtDiamonds.Rows[i - inStartIndex][j];
		//                        }

		//                    }
		//                    else
		//                    {
		//                        worksheet2.Cells[i, j + 1].Value = dtDiamonds.Rows[i - inStartIndex][j];
		//                    }
		//                }
		//                //worksheet2.Cells[i, colCount + 1].Formula = "Round(" + worksheet2.SelectedRange[i, 9].Address + "*" + worksheet2.SelectedRange[i, 11].Address + ",2)";
		//            }


		//            worksheet2.Cells[inEndCounter, 1].Formula = "COUNT(L" + inStartIndex + ":L" + (inEndCounter - 1) + ")";//Pcs
		//            worksheet2.Cells[inEndCounter, 9].Formula = "SUBTOTAL(9,I" + inStartIndex + ":I" + (inEndCounter - 1) + ")";//Rap Price        
		//            worksheet2.Cells[inEndCounter, 11].Formula = "SUBTOTAL(9,K" + inStartIndex + ":K" + (inEndCounter - 1) + ")";//Carat  
		//            worksheet2.Cells[inEndCounter, 12].Formula = "SUBTOTAL(9,L" + inStartIndex + ":L" + (inEndCounter - 1) + ")";//Amount                        
		//            worksheet2.Cells[inEndCounter, 13].Formula = "Round(" + worksheet2.SelectedRange[inEndCounter, 12].Address + "/" + worksheet2.SelectedRange[inEndCounter, 11].Address + ",2)";
		//            //worksheet2.Cells[inEndCounter, 34].Formula = "SUBTOTAL(9,AH" + inStartIndex + ":AH" + (inEndCounter - 1) + ")";//Rap Rate * Carat    
		//            //(((Sum(FinalValue) / SUM(RapaRate * Crt)) * 100) - 100  
		//            //worksheet2.Cells[inEndCounter, 10].Formula = "Round(" + ((worksheet2.SelectedRange[inEndCounter, 12].Address + "/" + worksheet2.SelectedRange[inEndCounter, 34].Address) + "*100 " + "-100") + ",2)";
		//            worksheet2.Cells[inEndCounter, 10].Formula = "ROUND((" + worksheet2.SelectedRange[inEndCounter, 12].Address + "/SUMPRODUCT(I" + inStartIndex + ":I" + (inEndCounter - 1)
		//                                                               + ",K" + inStartIndex + ":K" + (inEndCounter - 1) + "))* 100 - 100,2)";//Avg Dis


		//            ExcelStyle cellStyleSumFooterwrksh = worksheet2.Cells[inEndCounter, 1, inEndCounter, dtDiamonds.Columns.Count - 1].Style;
		//            cellStyleSumFooterwrksh.Border.Left.Style = cellStyleSumFooterwrksh.Border.Right.Style
		//                    = cellStyleSumFooterwrksh.Border.Top.Style = cellStyleSumFooterwrksh.Border.Bottom.Style
		//                    = ExcelBorderStyle.Medium;

		//            string Folderpath = RequestHelpers.GetConfigValue("RootDirFolderPath");
		//            string filename = stUsername + "_" + DateTime.Now.ToString("MMddyyyy") + "_" + DateTime.Now.ToString("hhmmss") + ".xlsx";

		//            if (Directory.Exists(HttpContext.Current.Server.MapPath(Folderpath)) == false)
		//            {
		//                Directory.CreateDirectory(HttpContext.Current.Server.MapPath(Folderpath));
		//            }

		//            stReturnFileName = HttpContext.Current.Server.MapPath(Folderpath + "\\" + filename);
		//            Byte[] bin = p.GetAsByteArray();

		//            System.IO.File.WriteAllBytes(stReturnFileName, bin);

		//            if (isExportPopup == true)
		//            {
		//                stReturnFileName = party_id + "\\" + filename; // return partyfolder + filename
		//            }
		//        }
		//    }
		//    catch (Exception ex)
		//    {
		//        inputData = inputData;
		//        ErrorLogger.ErrorLog(ex);
		//    }
		//    return stReturnFileName;
		//}



		//public static string ExportSearchResultExcel(List<Web_SL_Packet_Master_SearchStock_Result> _list, string stUsername)
		//{
		//	string stReturnFileName = "";
		//	int colHeaderIndex = 6;
		//	int startRowIndex = 7;
		//	int totalRows = _list.Count;
		//	int _totalCols = 22;
		//	int rowTotal = totalRows + startRowIndex;

		//	try
		//	{
		//		using (ExcelPackage p = new ExcelPackage())
		//		{
		//			#region Company Detail on Header
		//			p.Workbook.Properties.Author = "Pansuriya Impex";
		//			p.Workbook.Properties.Title = "Pansuriya Impex - Proposed Stock";
		//			//Create a sheet
		//			p.Workbook.Worksheets.Add("Suggested Diamonds");
		//			//Excel Worksheet 2
		//			ExcelWorksheet worksheet2 = p.Workbook.Worksheets[1];
		//			worksheet2.Name = "Stock_List " + DateTime.Now.ToString("dd-MM-yyyy");
		//			worksheet2.Cells.Style.Font.Size = 10;
		//			worksheet2.Cells.Style.Font.Name = "Calibri";
		//			worksheet2.Cells[1, 3, 4, 12].Style.Font.Bold = true;
		//			worksheet2.Cells[1, 3].Value = "Pansuriya Impex";
		//			worksheet2.Cells[1, 3].Style.Font.Size = 18;
		//			worksheet2.Cells[1, 3].Style.Font.Bold = true;
		//			worksheet2.Cells[1, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[1, 3].Style.Font.Color.SetColor(System.Drawing.Color.DarkBlue);
		//			worksheet2.Cells[2, 3].Value = "GE 1050, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra(e), Mumbai-400051, India.";
		//			worksheet2.Cells[2, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[3, 3].Value = "Tel.: (91) 22-4046 4444, FAX: (91) 22- 4046 4445";
		//			worksheet2.Cells[3, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[4, 3].Value = "Email: net@pansuriyaimpex.com";
		//			worksheet2.Cells[4, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[5, 4].Value = "Price/ct = TotalAmt/Carat   TotalAmt = Price/Ct*Carat";
		//			worksheet2.Cells[5, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

		//			worksheet2.Cells[1, 3, 1, 12].Merge = true;
		//			worksheet2.Cells[2, 3, 2, 12].Merge = true;
		//			worksheet2.Cells[3, 3, 3, 12].Merge = true;
		//			worksheet2.Cells[4, 3, 4, 12].Merge = true;
		//			worksheet2.Cells[5, 3, 5, 12].Merge = true;

		//			worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols + 1].AutoFilter = true;
		//			worksheet2.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			#endregion

		//			#region Header Name Declaration
		//			worksheet2.Cells[colHeaderIndex, 1].Value = "Sr. No.";
		//			worksheet2.Cells[colHeaderIndex, 2].Value = "Stone Id";
		//			worksheet2.Cells[colHeaderIndex, 3].Value = "Shape";
		//			worksheet2.Cells[colHeaderIndex, 4].Value = "Carat";
		//			worksheet2.Cells[colHeaderIndex, 5].Value = "Color";
		//			worksheet2.Cells[colHeaderIndex, 6].Value = "Clarity";
		//			worksheet2.Cells[colHeaderIndex, 7].Value = "Cut";
		//			worksheet2.Cells[colHeaderIndex, 8].Value = "Polish";
		//			worksheet2.Cells[colHeaderIndex, 9].Value = "Symmetry";
		//			worksheet2.Cells[colHeaderIndex, 10].Value = "Flo";
		//			worksheet2.Cells[colHeaderIndex, 11].Value = "Dis(%)";
		//			worksheet2.Cells[colHeaderIndex, 12].Value = "Rap Price";
		//			worksheet2.Cells[colHeaderIndex, 13].Value = "$/Cts";
		//			worksheet2.Cells[colHeaderIndex, 14].Value = "Amount";
		//			worksheet2.Cells[colHeaderIndex, 15].Value = "Lab";
		//			worksheet2.Cells[colHeaderIndex, 16].Value = "Certificate#";
		//			worksheet2.Cells[colHeaderIndex, 17].Value = "Insc";
		//			worksheet2.Cells[colHeaderIndex, 18].Value = "Mix Measurement";
		//			worksheet2.Cells[colHeaderIndex, 19].Value = "Dep(%)";
		//			worksheet2.Cells[colHeaderIndex, 20].Value = "Tab(%)";
		//			worksheet2.Cells[colHeaderIndex, 21].Value = "Location";
		//			worksheet2.Cells[colHeaderIndex, 22].Value = "Status";

		//			worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols + 1].Style.Font.Bold = true;

		//			ExcelStyle cellStyleHeaderwrks = worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols].Style;

		//			cellStyleHeaderwrks.Font.Bold = true;
		//			cellStyleHeaderwrks.Font.Color.SetColor(Color.White);
		//			cellStyleHeaderwrks.Fill.PatternType = ExcelFillStyle.Solid;
		//			cellStyleHeaderwrks.Fill.BackgroundColor.SetColor(Color.Gray);


		//			worksheet2.Cells[startRowIndex, 12, rowTotal + 1, 15].Style.Numberformat.Format = "#,0.00";

		//			#endregion

		//			#region Assign Values

		//			int _row = 0;
		//			int count = 0;
		//			for (int i = 0; i < totalRows; i++)
		//			{
		//				_row = i + startRowIndex;

		//				worksheet2.Cells[_row, 1].Value = (++count);
		//				worksheet2.Cells[_row, 2].Value = _list[i].Stone_ID;
		//				worksheet2.Cells[_row, 3].Value = _list[i].Shape_Name;
		//				worksheet2.Cells[_row, 4].Value = _list[i].CRT;
		//				worksheet2.Cells[_row, 5].Value = _list[i].Color_Name;
		//				worksheet2.Cells[_row, 6].Value = _list[i].Clarity_Name;
		//				worksheet2.Cells[_row, 7].Value = _list[i].Cut_Name;
		//				worksheet2.Cells[_row, 8].Value = _list[i].Polish_Name;
		//				worksheet2.Cells[_row, 9].Value = _list[i].Symmetry_Name;
		//				worksheet2.Cells[_row, 10].Value = _list[i].Florosence_Name;
		//				worksheet2.Cells[_row, 11].Value = _list[i].Dis;
		//				worksheet2.Cells[_row, 12].Value = _list[i].RapaRate.FormatRap();
		//				worksheet2.Cells[_row, 13].Value = _list[i].Price_Per_Crt;
		//				worksheet2.Cells[_row, 14].Value = _list[i].FinalValue;
		//				worksheet2.Cells[_row, 15].Value = _list[i].Lab_Name;

		//				worksheet2.Cells[_row, 16].Formula = "HYPERLINK(\"" + _list[i].Certificate_Name.GetCertificateUrl(_list[i].Lab_Name) + "\",\"" + _list[i].Certificate_Name + "\")";
		//				worksheet2.Cells[_row, 16].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
		//				worksheet2.Cells[_row, 16].Style.Font.UnderLine.ToString();

		//				worksheet2.Cells[_row, 17].Value = _list[i].Inscription;
		//				worksheet2.Cells[_row, 18].Value = _list[i].Measurement;
		//				worksheet2.Cells[_row, 19].Value = _list[i].depth;
		//				worksheet2.Cells[_row, 20].Value = _list[i].DTable;
		//				worksheet2.Cells[_row, 21].Value = _list[i].Location_Name;
		//				worksheet2.Cells[_row, 22].Value = _list[i].WebStatus;



		//			}

		//			#endregion

		//			worksheet2.Cells[rowTotal, 2].Formula = "COUNT(A" + startRowIndex + ":A" + (totalRows + colHeaderIndex) + ")";//Pcs
		//			worksheet2.Cells[rowTotal, 4].Formula = "SUM(D" + startRowIndex + ":D" + (totalRows + colHeaderIndex) + ")";//Carat

		//			worksheet2.Cells[rowTotal, 14].Formula = "SUM(N" + startRowIndex + ":N" + (totalRows + colHeaderIndex) + ")";//Amount


		//			// Total RapaRate = Sum(RapRate * Cts) / Sum(Cts)
		//			//worksheet2.Cells[rowTotal, 12].Formula = "ROUND(SUMPRODUCT(L" + startRowIndex + ":L" + (totalRows + colHeaderIndex)
		//			//+ ",D" + startRowIndex + ":D" + (totalRows + colHeaderIndex) + ")/D" + (totalRows + colHeaderIndex + 1) + ",2)";

		//			// Avg $/Cts = Sum($/Cts)/Sum(Cts)
		//			//worksheet2.Cells[rowTotal, 13].Formula = "=(N" + (totalRows + colHeaderIndex + 1) + "/D" + (totalRows + colHeaderIndex + 1) + ")";




		//			//worksheet2.Cells[rowTotal, 12].Formula = "ROUND((" + worksheet2.SelectedRange[rowTotal, 18].Address + "/SUMPRODUCT(M" + startRowIndex + ":M" + (totalRows + colHeaderIndex)
		//			//                                                  + ",K" + startRowIndex + ":K" + (totalRows + colHeaderIndex) + "))* 100 - 100,2)";//Avg Dis

		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Font.Bold = true;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Font.Size = 12;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.PatternType = ExcelFillStyle.Solid;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.BackgroundColor.SetColor(Color.DarkGray);


		//			//worksheet2.Cells[colHeaderIndex, 10].AutoFitColumns();
		//			worksheet2.Cells[colHeaderIndex, 1, rowTotal, _totalCols + 1].AutoFitColumns();

		//			string Folderpath = RequestHelpers.GetConfigValue("ExportFilePath");
		//			string filename = stUsername + "_" + DateTime.Now.ToString("MMddyyyy") + "_" + DateTime.Now.ToString("hhmmss") + ".xlsx";

		//			if (Directory.Exists(HttpContext.Current.Server.MapPath(Folderpath)) == false)
		//			{
		//				Directory.CreateDirectory(HttpContext.Current.Server.MapPath(Folderpath));
		//			}

		//			stReturnFileName = HttpContext.Current.Server.MapPath(Folderpath + "\\" + "ExportStone.xlsx");
		//			Byte[] bin = p.GetAsByteArray();

		//			System.IO.File.WriteAllBytes(stReturnFileName, bin);
		//		}
		//	}
		//	catch (Exception ex)
		//	{
		//		ErrorLogger.ErrorLog(ex);
		//	}
		//	return stReturnFileName;
		//}

		//public static string ExportCartResultExcel(List<viewtocart_Result> _list, string stUsername)
		//{
		//	string stReturnFileName = "";
		//	int colHeaderIndex = 6;
		//	int startRowIndex = 7;
		//	int totalRows = _list.Count;
		//	int _totalCols = 22;
		//	int rowTotal = totalRows + startRowIndex;

		//	try
		//	{
		//		using (ExcelPackage p = new ExcelPackage())
		//		{
		//			#region Company Detail on Header
		//			p.Workbook.Properties.Author = "Pansuriya Impex";
		//			p.Workbook.Properties.Title = "Pansuriya Impex - Proposed Stock";
		//			//Create a sheet
		//			p.Workbook.Worksheets.Add("Suggested Diamonds");
		//			//Excel Worksheet 2
		//			ExcelWorksheet worksheet2 = p.Workbook.Worksheets[1];
		//			worksheet2.Name = "Stock_List " + DateTime.Now.ToString("dd-MM-yyyy");
		//			worksheet2.Cells.Style.Font.Size = 10;
		//			worksheet2.Cells.Style.Font.Name = "Calibri";
		//			worksheet2.Cells[1, 3, 4, 12].Style.Font.Bold = true;
		//			worksheet2.Cells[1, 3].Value = "Pansuriya Impex";
		//			worksheet2.Cells[1, 3].Style.Font.Size = 18;
		//			worksheet2.Cells[1, 3].Style.Font.Bold = true;
		//			worksheet2.Cells[1, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[1, 3].Style.Font.Color.SetColor(System.Drawing.Color.DarkBlue);
		//			worksheet2.Cells[2, 3].Value = "GE 1050, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra(e), Mumbai-400051, India.";
		//			worksheet2.Cells[2, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[3, 3].Value = "Tel.: (91) 22-4046 4444, FAX: (91) 22- 4046 4445";
		//			worksheet2.Cells[3, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[4, 3].Value = "Email: net@pansuriyaimpex.com";
		//			worksheet2.Cells[4, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[5, 4].Value = "Price/ct = TotalAmt/Carat   TotalAmt = Price/Ct*Carat";
		//			worksheet2.Cells[5, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

		//			worksheet2.Cells[1, 3, 1, 12].Merge = true;
		//			worksheet2.Cells[2, 3, 2, 12].Merge = true;
		//			worksheet2.Cells[3, 3, 3, 12].Merge = true;
		//			worksheet2.Cells[4, 3, 4, 12].Merge = true;
		//			worksheet2.Cells[5, 3, 5, 12].Merge = true;

		//			worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols + 1].AutoFilter = true;
		//			worksheet2.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			#endregion

		//			#region Header Name Declaration
		//			worksheet2.Cells[colHeaderIndex, 1].Value = "Sr. No.";
		//			worksheet2.Cells[colHeaderIndex, 2].Value = "Stone Id";
		//			worksheet2.Cells[colHeaderIndex, 3].Value = "Shape";
		//			worksheet2.Cells[colHeaderIndex, 4].Value = "Carat";
		//			worksheet2.Cells[colHeaderIndex, 5].Value = "Color";
		//			worksheet2.Cells[colHeaderIndex, 6].Value = "Clarity";
		//			worksheet2.Cells[colHeaderIndex, 7].Value = "Cut";
		//			worksheet2.Cells[colHeaderIndex, 8].Value = "Polish";
		//			worksheet2.Cells[colHeaderIndex, 9].Value = "Symmetry";
		//			worksheet2.Cells[colHeaderIndex, 10].Value = "Flo";
		//			worksheet2.Cells[colHeaderIndex, 11].Value = "Dis(%)";
		//			worksheet2.Cells[colHeaderIndex, 12].Value = "Rap Price";
		//			worksheet2.Cells[colHeaderIndex, 13].Value = "$/Cts";
		//			worksheet2.Cells[colHeaderIndex, 14].Value = "Amount";
		//			worksheet2.Cells[colHeaderIndex, 15].Value = "Lab";
		//			worksheet2.Cells[colHeaderIndex, 16].Value = "Certificate#";
		//			worksheet2.Cells[colHeaderIndex, 17].Value = "Insc";
		//			worksheet2.Cells[colHeaderIndex, 18].Value = "Mix Measurement";
		//			worksheet2.Cells[colHeaderIndex, 19].Value = "Dep(%)";
		//			worksheet2.Cells[colHeaderIndex, 20].Value = "Tab(%)";
		//			worksheet2.Cells[colHeaderIndex, 21].Value = "Location";
		//			worksheet2.Cells[colHeaderIndex, 22].Value = "Status";

		//			worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols + 1].Style.Font.Bold = true;

		//			ExcelStyle cellStyleHeaderwrks = worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols].Style;

		//			cellStyleHeaderwrks.Font.Bold = true;
		//			cellStyleHeaderwrks.Font.Color.SetColor(Color.White);
		//			cellStyleHeaderwrks.Fill.PatternType = ExcelFillStyle.Solid;
		//			cellStyleHeaderwrks.Fill.BackgroundColor.SetColor(Color.Gray);


		//			worksheet2.Cells[startRowIndex, 12, rowTotal + 1, 15].Style.Numberformat.Format = "#,0.00";

		//			#endregion

		//			#region Assign Values

		//			int _row = 0;
		//			int count = 0;
		//			for (int i = 0; i < totalRows; i++)
		//			{
		//				_row = i + startRowIndex;

		//				worksheet2.Cells[_row, 1].Value = (++count);
		//				worksheet2.Cells[_row, 2].Value = _list[i].STONE_ID;
		//				worksheet2.Cells[_row, 3].Value = _list[i].SHAPE_CODE;
		//				worksheet2.Cells[_row, 4].Value = _list[i].CARAT;
		//				worksheet2.Cells[_row, 5].Value = _list[i].COLOR_CODE;
		//				worksheet2.Cells[_row, 6].Value = _list[i].CLARITY_CODE;
		//				worksheet2.Cells[_row, 7].Value = _list[i].CUT_CODE;
		//				worksheet2.Cells[_row, 8].Value = _list[i].POLISH_CODE;
		//				worksheet2.Cells[_row, 9].Value = _list[i].SYMMETRY_CODE;
		//				worksheet2.Cells[_row, 10].Value = _list[i].FLUORESCENCE_CODE;
		//				worksheet2.Cells[_row, 11].Value = _list[i].DISCOUNT;
		//				worksheet2.Cells[_row, 12].Value = _list[i].RAPPRICE;
		//				worksheet2.Cells[_row, 13].Value = _list[i].PRICEPERCRT;
		//				worksheet2.Cells[_row, 14].Value = _list[i].AMOUNT;
		//				worksheet2.Cells[_row, 15].Value = _list[i].LAB;

		//				worksheet2.Cells[_row, 16].Formula = "HYPERLINK(\"" + _list[i].CERT_URL.GetCertificateUrl(_list[i].LAB) + "\",\"" + _list[i].CERTNO + "\")";
		//				worksheet2.Cells[_row, 16].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
		//				worksheet2.Cells[_row, 16].Style.Font.UnderLine.ToString();

		//				worksheet2.Cells[_row, 17].Value = _list[i].INSCRIPTION;
		//				worksheet2.Cells[_row, 18].Value = _list[i].MEASUREMENTS;
		//				worksheet2.Cells[_row, 19].Value = _list[i].DEPTH;
		//				worksheet2.Cells[_row, 20].Value = _list[i].TABLE1;
		//				worksheet2.Cells[_row, 21].Value = _list[i].LOCATION;
		//				worksheet2.Cells[_row, 22].Value = _list[i].STATUS;



		//			}

		//			#endregion

		//			worksheet2.Cells[rowTotal, 2].Formula = "COUNT(A" + startRowIndex + ":A" + (totalRows + colHeaderIndex) + ")";//Pcs
		//																																																										//worksheet2.Cells[rowTotal, 4].Formula = "SUM(D" + startRowIndex + ":D" + (totalRows + colHeaderIndex) + ")";//Carat

		//			worksheet2.Cells[rowTotal, 14].Formula = "SUM(N" + startRowIndex + ":N" + (totalRows + colHeaderIndex) + ")";//Amount


		//			// Total RapaRate = Sum(RapRate * Cts) / Sum(Cts)
		//			//worksheet2.Cells[rowTotal, 12].Formula = "ROUND(SUMPRODUCT(L" + startRowIndex + ":L" + (totalRows + colHeaderIndex)
		//			//+ ",D" + startRowIndex + ":D" + (totalRows + colHeaderIndex) + ")/D" + (totalRows + colHeaderIndex + 1) + ",2)";

		//			// Avg $/Cts = Sum($/Cts)/Sum(Cts)
		//			//worksheet2.Cells[rowTotal, 13].Formula = "=(N" + (totalRows + colHeaderIndex + 1) + "/D" + (totalRows + colHeaderIndex + 1) + ")";




		//			//worksheet2.Cells[rowTotal, 12].Formula = "ROUND((" + worksheet2.SelectedRange[rowTotal, 18].Address + "/SUMPRODUCT(M" + startRowIndex + ":M" + (totalRows + colHeaderIndex)
		//			//                                                  + ",K" + startRowIndex + ":K" + (totalRows + colHeaderIndex) + "))* 100 - 100,2)";//Avg Dis

		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Font.Bold = true;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Font.Size = 12;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.PatternType = ExcelFillStyle.Solid;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.BackgroundColor.SetColor(Color.DarkGray);


		//			//worksheet2.Cells[colHeaderIndex, 10].AutoFitColumns();
		//			worksheet2.Cells[colHeaderIndex, 1, rowTotal, _totalCols + 1].AutoFitColumns();

		//			string Folderpath = RequestHelpers.GetConfigValue("ExportFilePath");
		//			string filename = stUsername + "_" + DateTime.Now.ToString("MMddyyyy") + "_" + DateTime.Now.ToString("hhmmss") + ".xlsx";

		//			if (Directory.Exists(HttpContext.Current.Server.MapPath(Folderpath)) == false)
		//			{
		//				Directory.CreateDirectory(HttpContext.Current.Server.MapPath(Folderpath));
		//			}

		//			stReturnFileName = HttpContext.Current.Server.MapPath(Folderpath + "\\ExportStone.xlsx");
		//			Byte[] bin = p.GetAsByteArray();

		//			System.IO.File.WriteAllBytes(stReturnFileName, bin);
		//		}
		//	}
		//	catch (Exception ex)
		//	{
		//		ErrorLogger.ErrorLog(ex);
		//	}
		//	return stReturnFileName;
		//}

		//public static string ExportWatchListResult(List<SL_Packet_Web_Master_GetWatchList_Result> _list, string stUsername)
		//{
		//	string stReturnFileName = "";
		//	int colHeaderIndex = 6;
		//	int startRowIndex = 7;
		//	int totalRows = _list.Count;
		//	int _totalCols = 22;
		//	int rowTotal = totalRows + startRowIndex;

		//	try
		//	{
		//		using (ExcelPackage p = new ExcelPackage())
		//		{
		//			#region Company Detail on Header
		//			p.Workbook.Properties.Author = "Pansuriya Impex";
		//			p.Workbook.Properties.Title = "Pansuriya Impex - Proposed Stock";
		//			//Create a sheet
		//			p.Workbook.Worksheets.Add("Suggested Diamonds");
		//			//Excel Worksheet 2
		//			ExcelWorksheet worksheet2 = p.Workbook.Worksheets[1];
		//			worksheet2.Name = "Stock_List " + DateTime.Now.ToString("dd-MM-yyyy");
		//			worksheet2.Cells.Style.Font.Size = 10;
		//			worksheet2.Cells.Style.Font.Name = "Calibri";
		//			worksheet2.Cells[1, 3, 4, 12].Style.Font.Bold = true;
		//			worksheet2.Cells[1, 3].Value = "Pansuriya Impex";
		//			worksheet2.Cells[1, 3].Style.Font.Size = 18;
		//			worksheet2.Cells[1, 3].Style.Font.Bold = true;
		//			worksheet2.Cells[1, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[1, 3].Style.Font.Color.SetColor(System.Drawing.Color.DarkBlue);
		//			worksheet2.Cells[2, 3].Value = "GE 1050, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra(e), Mumbai-400051, India.";
		//			worksheet2.Cells[2, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[3, 3].Value = "Tel.: (91) 22-4046 4444, FAX: (91) 22- 4046 4445";
		//			worksheet2.Cells[3, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[4, 3].Value = "Email: net@pansuriyaimpex.com";
		//			worksheet2.Cells[4, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			worksheet2.Cells[5, 4].Value = "Price/ct = TotalAmt/Carat   TotalAmt = Price/Ct*Carat";
		//			worksheet2.Cells[5, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

		//			worksheet2.Cells[1, 3, 1, 12].Merge = true;
		//			worksheet2.Cells[2, 3, 2, 12].Merge = true;
		//			worksheet2.Cells[3, 3, 3, 12].Merge = true;
		//			worksheet2.Cells[4, 3, 4, 12].Merge = true;
		//			worksheet2.Cells[5, 3, 5, 12].Merge = true;

		//			worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols + 1].AutoFilter = true;
		//			worksheet2.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//			#endregion

		//			#region Header Name Declaration
		//			worksheet2.Cells[colHeaderIndex, 1].Value = "Sr. No.";
		//			worksheet2.Cells[colHeaderIndex, 2].Value = "Stone Id";
		//			worksheet2.Cells[colHeaderIndex, 3].Value = "Shape";
		//			worksheet2.Cells[colHeaderIndex, 4].Value = "Carat";
		//			worksheet2.Cells[colHeaderIndex, 5].Value = "Color";
		//			worksheet2.Cells[colHeaderIndex, 6].Value = "Clarity";
		//			worksheet2.Cells[colHeaderIndex, 7].Value = "Cut";
		//			worksheet2.Cells[colHeaderIndex, 8].Value = "Polish";
		//			worksheet2.Cells[colHeaderIndex, 9].Value = "Symmetry";
		//			worksheet2.Cells[colHeaderIndex, 10].Value = "Flo";
		//			worksheet2.Cells[colHeaderIndex, 11].Value = "Dis(%)";
		//			worksheet2.Cells[colHeaderIndex, 12].Value = "Rap Price";
		//			worksheet2.Cells[colHeaderIndex, 13].Value = "$/Cts";
		//			worksheet2.Cells[colHeaderIndex, 14].Value = "Amount";
		//			worksheet2.Cells[colHeaderIndex, 15].Value = "Lab";
		//			worksheet2.Cells[colHeaderIndex, 16].Value = "Certificate#";
		//			worksheet2.Cells[colHeaderIndex, 17].Value = "Insc";
		//			worksheet2.Cells[colHeaderIndex, 18].Value = "Mix Measurement";
		//			worksheet2.Cells[colHeaderIndex, 19].Value = "Dep(%)";
		//			worksheet2.Cells[colHeaderIndex, 20].Value = "Tab(%)";
		//			worksheet2.Cells[colHeaderIndex, 21].Value = "Location";
		//			worksheet2.Cells[colHeaderIndex, 22].Value = "Status";

		//			worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols + 1].Style.Font.Bold = true;

		//			ExcelStyle cellStyleHeaderwrks = worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols].Style;

		//			cellStyleHeaderwrks.Font.Bold = true;
		//			cellStyleHeaderwrks.Font.Color.SetColor(Color.White);
		//			cellStyleHeaderwrks.Fill.PatternType = ExcelFillStyle.Solid;
		//			cellStyleHeaderwrks.Fill.BackgroundColor.SetColor(Color.Gray);


		//			worksheet2.Cells[startRowIndex, 12, rowTotal + 1, 15].Style.Numberformat.Format = "#,0.00";

		//			#endregion

		//			#region Assign Values

		//			int _row = 0;
		//			int count = 0;
		//			for (int i = 0; i < totalRows; i++)
		//			{
		//				_row = i + startRowIndex;

		//				worksheet2.Cells[_row, 1].Value = (++count);
		//				worksheet2.Cells[_row, 2].Value = _list[i].STONE_ID;
		//				worksheet2.Cells[_row, 3].Value = _list[i].SHAPE_CODE;
		//				worksheet2.Cells[_row, 4].Value = _list[i].CARAT;
		//				worksheet2.Cells[_row, 5].Value = _list[i].COLOR_CODE;
		//				worksheet2.Cells[_row, 6].Value = _list[i].CLARITY_CODE;
		//				worksheet2.Cells[_row, 7].Value = _list[i].CUT_CODE;
		//				worksheet2.Cells[_row, 8].Value = _list[i].POLISH_CODE;
		//				worksheet2.Cells[_row, 9].Value = _list[i].SYMMETRY_CODE;
		//				worksheet2.Cells[_row, 10].Value = _list[i].FLUORESCENCE_CODE;
		//				worksheet2.Cells[_row, 11].Value = _list[i].DISCOUNT;
		//				worksheet2.Cells[_row, 12].Value = _list[i].RAPPRICE;
		//				worksheet2.Cells[_row, 13].Value = _list[i].PRICEPERCRT;
		//				worksheet2.Cells[_row, 14].Value = _list[i].AMOUNT;
		//				worksheet2.Cells[_row, 15].Value = _list[i].LAB;

		//				worksheet2.Cells[_row, 16].Formula = "HYPERLINK(\"" + _list[i].CERT_URL.GetCertificateUrl(_list[i].LAB) + "\",\"" + _list[i].CERT_URL + "\")";
		//				worksheet2.Cells[_row, 16].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
		//				worksheet2.Cells[_row, 16].Style.Font.UnderLine.ToString();

		//				worksheet2.Cells[_row, 17].Value = _list[i].INSCRIPTION;
		//				worksheet2.Cells[_row, 18].Value = _list[i].MEASUREMENTS;
		//				worksheet2.Cells[_row, 19].Value = _list[i].DEPTH;
		//				worksheet2.Cells[_row, 20].Value = _list[i].TABLE1;
		//				worksheet2.Cells[_row, 21].Value = _list[i].LOCATION;
		//				worksheet2.Cells[_row, 22].Value = _list[i].STATUS;



		//			}

		//			#endregion

		//			worksheet2.Cells[rowTotal, 2].Formula = "COUNT(A" + startRowIndex + ":A" + (totalRows + colHeaderIndex) + ")";//Pcs
		//			worksheet2.Cells[rowTotal, 4].Formula = "SUM(D" + startRowIndex + ":D" + (totalRows + colHeaderIndex) + ")";//Carat

		//			worksheet2.Cells[rowTotal, 14].Formula = "SUM(N" + startRowIndex + ":N" + (totalRows + colHeaderIndex) + ")";//Amount


		//			// Total RapaRate = Sum(RapRate * Cts) / Sum(Cts)
		//			//worksheet2.Cells[rowTotal, 12].Formula = "ROUND(SUMPRODUCT(L" + startRowIndex + ":L" + (totalRows + colHeaderIndex)
		//			//+ ",D" + startRowIndex + ":D" + (totalRows + colHeaderIndex) + ")/D" + (totalRows + colHeaderIndex + 1) + ",2)";

		//			// Avg $/Cts = Sum($/Cts)/Sum(Cts)
		//			//worksheet2.Cells[rowTotal, 13].Formula = "=(N" + (totalRows + colHeaderIndex + 1) + "/D" + (totalRows + colHeaderIndex + 1) + ")";




		//			//worksheet2.Cells[rowTotal, 12].Formula = "ROUND((" + worksheet2.SelectedRange[rowTotal, 18].Address + "/SUMPRODUCT(M" + startRowIndex + ":M" + (totalRows + colHeaderIndex)
		//			//                                                  + ",K" + startRowIndex + ":K" + (totalRows + colHeaderIndex) + "))* 100 - 100,2)";//Avg Dis

		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Font.Bold = true;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Font.Size = 12;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.PatternType = ExcelFillStyle.Solid;
		//			worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.BackgroundColor.SetColor(Color.DarkGray);


		//			//worksheet2.Cells[colHeaderIndex, 10].AutoFitColumns();
		//			worksheet2.Cells[colHeaderIndex, 1, rowTotal, _totalCols + 1].AutoFitColumns();

		//			string Folderpath = RequestHelpers.GetConfigValue("ExportFilePath");
		//			string filename = stUsername + "_" + DateTime.Now.ToString("MMddyyyy") + "_" + DateTime.Now.ToString("hhmmss") + ".xlsx";

		//			if (Directory.Exists(HttpContext.Current.Server.MapPath(Folderpath)) == false)
		//			{
		//				Directory.CreateDirectory(HttpContext.Current.Server.MapPath(Folderpath));
		//			}

		//			stReturnFileName = HttpContext.Current.Server.MapPath(Folderpath + "\\" + "ExportStone.xlsx");
		//			Byte[] bin = p.GetAsByteArray();

		//			System.IO.File.WriteAllBytes(stReturnFileName, bin);
		//		}
		//	}
		//	catch (Exception ex)
		//	{
		//		ErrorLogger.ErrorLog(ex);
		//	}
		//	return stReturnFileName;
		//}


		//public static string ExportSalesData(List<Web_Admin_GetSalesByParty_Result> _list, string stUsername)
		//{
		//    string stReturnFileName = "";
		//    int colHeaderIndex = 6;
		//    int startRowIndex = 7;
		//    int totalRows = _list.Count;
		//    int _totalCols = 24;
		//    int rowTotal = totalRows + startRowIndex;

		//    try
		//    {
		//        using (ExcelPackage p = new ExcelPackage())
		//        {
		//            #region Company Detail on Header
		//            p.Workbook.Properties.Author = "Pansuriya Impex";
		//            p.Workbook.Properties.Title = "Pansuriya Impex - Proposed Stock";
		//            //Create a sheet
		//            p.Workbook.Worksheets.Add("Suggested Diamonds");
		//            //Excel Worksheet 2
		//            ExcelWorksheet worksheet2 = p.Workbook.Worksheets[1];
		//            worksheet2.Name = "Stock_List " + DateTime.Now.ToString("dd-MM-yyyy");
		//            worksheet2.Cells.Style.Font.Size = 10;
		//            worksheet2.Cells.Style.Font.Name = "Calibri";
		//            worksheet2.Cells[1, 3, 4, 12].Style.Font.Bold = true;
		//            worksheet2.Cells[1, 3].Value = "Pansuriya Impex PVT. LTD.";
		//            worksheet2.Cells[1, 3].Style.Font.Size = 18;
		//            worksheet2.Cells[1, 3].Style.Font.Bold = true;
		//            worksheet2.Cells[1, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[1, 3].Style.Font.Color.SetColor(System.Drawing.Color.DarkBlue);
		//            worksheet2.Cells[2, 3].Value = "GE 1050, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra(e), Mumbai-400051, India.";
		//            worksheet2.Cells[2, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[3, 3].Value = "Tel.: (91) 22-4046 4444, FAX: (91) 22- 4046 4445";
		//            worksheet2.Cells[3, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[4, 3].Value = "Email: net@pansuriyaimpex.com";
		//            worksheet2.Cells[4, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            worksheet2.Cells[5, 4].Value = "Price/ct = TotalAmt/Carat   TotalAmt = Price/Ct*Carat";
		//            worksheet2.Cells[5, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

		//            worksheet2.Cells[1, 3, 1, 12].Merge = true;
		//            worksheet2.Cells[2, 3, 2, 12].Merge = true;
		//            worksheet2.Cells[3, 3, 3, 12].Merge = true;
		//            worksheet2.Cells[4, 3, 4, 12].Merge = true;
		//            worksheet2.Cells[5, 3, 5, 12].Merge = true;

		//            worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols + 1].AutoFilter = true;
		//            worksheet2.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
		//            #endregion

		//            #region Header Name Declaration
		//            worksheet2.Cells[colHeaderIndex, 1].Value = "Stone Id";
		//            worksheet2.Cells[colHeaderIndex, 2].Value = "Shape";
		//            worksheet2.Cells[colHeaderIndex, 3].Value = "Color";
		//            worksheet2.Cells[colHeaderIndex, 4].Value = "Clarity";
		//            worksheet2.Cells[colHeaderIndex, 5].Value = "Cut";
		//            worksheet2.Cells[colHeaderIndex, 6].Value = "Polish";
		//            worksheet2.Cells[colHeaderIndex, 7].Value = "Symmetry";
		//            worksheet2.Cells[colHeaderIndex, 8].Value = "Florosence";
		//            worksheet2.Cells[colHeaderIndex, 9].Value = "Lab";
		//            worksheet2.Cells[colHeaderIndex, 10].Value = "Certificate#";
		//            worksheet2.Cells[colHeaderIndex, 11].Value = "Rap Price";
		//            worksheet2.Cells[colHeaderIndex, 12].Value = "Dis(%)";
		//            worksheet2.Cells[colHeaderIndex, 13].Value = "Carat";
		//            worksheet2.Cells[colHeaderIndex, 14].Value = "Amount";
		//            worksheet2.Cells[colHeaderIndex, 15].Value = "Price/Carat";

		//            worksheet2.Cells[colHeaderIndex, 16].Value = "Table";
		//            worksheet2.Cells[colHeaderIndex, 17].Value = "Depth";

		//            worksheet2.Cells[colHeaderIndex, 18].Value = "Measurement";
		//            worksheet2.Cells[colHeaderIndex, 19].Value = "Cr Ang";
		//            worksheet2.Cells[colHeaderIndex, 20].Value = "Pav Ang";
		//            worksheet2.Cells[colHeaderIndex, 21].Value = "Cr Height";
		//            worksheet2.Cells[colHeaderIndex, 22].Value = "Pav Height";
		//            worksheet2.Cells[colHeaderIndex, 23].Value = "Gridle";
		//            worksheet2.Cells[colHeaderIndex, 24].Value = "Fancy Color";

		//            worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols].Style.Font.Bold = true;

		//            ExcelStyle cellStyleHeaderwrks = worksheet2.Cells[colHeaderIndex, 1, colHeaderIndex, _totalCols].Style;

		//            cellStyleHeaderwrks.Font.Bold = true;
		//            cellStyleHeaderwrks.Font.Color.SetColor(Color.White);
		//            cellStyleHeaderwrks.Fill.PatternType = ExcelFillStyle.Solid;
		//            cellStyleHeaderwrks.Fill.BackgroundColor.SetColor(Color.Gray);


		//            worksheet2.Cells[startRowIndex, 11, rowTotal + 1, 18].Style.Numberformat.Format = "#,0.00";
		//            worksheet2.Cells[startRowIndex, 22, rowTotal + 1, 24].Style.Numberformat.Format = "#,0.00";
		//            //worksheet2.Cells[startRowIndex, 21, rowTotal, 21].Style.Numberformat.Format = "dd-MM-yyyy";
		//            #endregion

		//            #region Assign Values
		//            int _row = 0;
		//            for (int i = 0; i < totalRows; i++)
		//            {
		//                _row = i + startRowIndex;

		//                worksheet2.Cells[_row, 1].Value = _list[i].Stone_ID;
		//                worksheet2.Cells[_row, 2].Value = _list[i].Shape_Name;
		//                worksheet2.Cells[_row, 3].Value = _list[i].Color_Name;
		//                worksheet2.Cells[_row, 4].Value = _list[i].Clarity_Name;
		//                worksheet2.Cells[_row, 5].Value = _list[i].Cut_Name;
		//                worksheet2.Cells[_row, 6].Value = _list[i].Polish_Name;
		//                worksheet2.Cells[_row, 7].Value = _list[i].Symmetry_Name;
		//                worksheet2.Cells[_row, 8].Value = _list[i].Florosence_Name;
		//                worksheet2.Cells[_row, 9].Value = _list[i].Lab_Name;
		//                //worksheet2.Cells[_row, 10].Value = _list[i].Certificate_Name;
		//                worksheet2.Cells[_row, 10].Formula = "HYPERLINK(\"" + _list[i].Certificate_Name.GetCertificateUrl(_list[i].Lab_Name) + "\",\"" + _list[i].Certificate_Name + "\")";
		//                worksheet2.Cells[_row, 10].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
		//                worksheet2.Cells[_row, 10].Style.Font.UnderLine.ToString();

		//                worksheet2.Cells[_row, 11].Value = _list[i].RapaRate;
		//                worksheet2.Cells[_row, 12].Value = _list[i].Dis;
		//                worksheet2.Cells[_row, 13].Value = _list[i].CRT;
		//                worksheet2.Cells[_row, 14].Value = _list[i].FinalValue;
		//                worksheet2.Cells[_row, 15].Value = _list[i].Price_Per_Crt;

		//                if (_list[i].DTable > 0)
		//                    worksheet2.Cells[_row, 16].Value = _list[i].DTable;
		//                if (_list[i].depth > 0)
		//                    worksheet2.Cells[_row, 17].Value = _list[i].depth;
		//                worksheet2.Cells[_row, 18].Value = _list[i].Measurement;
		//                if (_list[i].CrAng > 0)
		//                    worksheet2.Cells[_row, 19].Value = _list[i].CrAng;
		//                if (_list[i].PavAng > 0)
		//                    worksheet2.Cells[_row, 20].Value = _list[i].PavAng;
		//                if (_list[i].CrHeight > 0)
		//                    worksheet2.Cells[_row, 21].Value = _list[i].CrHeight;
		//                if (_list[i].PavHeight > 0)
		//                    worksheet2.Cells[_row, 22].Value = _list[i].PavHeight;
		//                if (_list[i].Gridle > 0)
		//                    worksheet2.Cells[_row, 23].Value = _list[i].Gridle;
		//                worksheet2.Cells[_row, 24].Value = _list[i].Fancy_Color;
		//            }
		//            #endregion

		//            worksheet2.Cells[rowTotal, 1].Formula = "COUNT(O" + startRowIndex + ":O" + (totalRows + colHeaderIndex) + ")";//Pcs
		//            worksheet2.Cells[rowTotal, 13].Formula = "SUBTOTAL(9,M" + startRowIndex + ":M" + (totalRows + colHeaderIndex) + ")";//Carat
		//            worksheet2.Cells[rowTotal, 14].Formula = "SUBTOTAL(9,N" + startRowIndex + ":N" + (totalRows + colHeaderIndex) + ")";//Amount

		//            worksheet2.Cells[rowTotal, 15].Formula = "SUBTOTAL(9,N" + startRowIndex + ":N" + (totalRows + colHeaderIndex) + ")/"
		//                + "SUBTOTAL(9,M" + startRowIndex + ":M" + (totalRows + colHeaderIndex) + ")";// Avg Price/Carat

		//            worksheet2.Cells[rowTotal, 11].Formula = "SUMPRODUCT(M" + startRowIndex + ":M" + (totalRows + colHeaderIndex)
		//                                                                + ",K" + startRowIndex + ":K" + (totalRows + colHeaderIndex) + ")/" + worksheet2.SelectedRange[rowTotal, 13].Address;//Avg Rapa Rate

		//            worksheet2.Cells[rowTotal, 12].Formula = "ROUND((" + worksheet2.SelectedRange[rowTotal, 14].Address + "/SUMPRODUCT(M" + startRowIndex + ":M" + (totalRows + colHeaderIndex)
		//                                                                + ",K" + startRowIndex + ":K" + (totalRows + colHeaderIndex) + "))* 100 - 100,2)";//Avg Dis


		//            worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Font.Bold = true;
		//            worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.PatternType = ExcelFillStyle.Solid;
		//            worksheet2.Cells[rowTotal, 1, rowTotal, _totalCols].Style.Fill.BackgroundColor.SetColor(Color.DarkGray);

		//            worksheet2.Cells[colHeaderIndex, 1, rowTotal, _totalCols + 1].AutoFitColumns();

		//            string Folderpath = RequestHelpers.GetConfigValue("PricingRptFolderPath");
		//            string filename = stUsername + "_" + DateTime.Now.ToString("MMddyyyy") + "_" + DateTime.Now.ToString("hhmmss") + ".xlsx";

		//            if (Directory.Exists(HttpContext.Current.Server.MapPath(Folderpath)) == false)
		//            {
		//                Directory.CreateDirectory(HttpContext.Current.Server.MapPath(Folderpath));
		//            }

		//            stReturnFileName = HttpContext.Current.Server.MapPath(Folderpath + "\\" + "ExportStone.xlsx");
		//            Byte[] bin = p.GetAsByteArray();

		//            System.IO.File.WriteAllBytes(stReturnFileName, bin);
		//        }
		//    }
		//    catch (Exception ex)
		//    {
		//        ErrorLogger.ErrorLog(ex);
		//    }
		//    return stReturnFileName;
		//}
	}
}