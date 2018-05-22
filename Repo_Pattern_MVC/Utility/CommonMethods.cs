using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Dynamic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Reflection;
using System.Reflection.Emit;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
namespace Repo_Pattern_MVC.Utility
{
	public class CommonMethods
	{
		/// <summary>
		/// Gets a Inverted DataTable
		/// </summary>
		/// <param name="table">DataTable do invert</param>
		/// <param name="columnX">X Axis Column</param>
		/// <param name="nullValue">null Value to Complete the Pivot Table</param>
		/// <param name="columnsToIgnore">Columns that should be ignored in the pivot 
		/// process (X Axis column is ignored by default)</param>
		/// <returns>C# Pivot Table Method  - Felipe Sabino</returns>

		public static DataTable GetInversedDataTable(DataTable table, string columnX,
																								 params string[] columnsToIgnore)
		{
			//Create a DataTable to Return
			DataTable returnTable = new DataTable();

			if (columnX == "")
				columnX = table.Columns[0].ColumnName;

			//Add a Column at the beginning of the table

			returnTable.Columns.Add(columnX);

			//Read all DISTINCT values from columnX Column in the provided DataTale
			List<string> columnXValues = new List<string>();

			//Creates list of columns to ignore
			List<string> listColumnsToIgnore = new List<string>();
			if (columnsToIgnore.Length > 0)
				listColumnsToIgnore.AddRange(columnsToIgnore);

			if (!listColumnsToIgnore.Contains(columnX))
				listColumnsToIgnore.Add(columnX);

			foreach (DataRow dr in table.Rows)
			{
				string columnXTemp = dr[columnX].ToString();
				//Verify if the value was already listed
				if (!columnXValues.Contains(columnXTemp))
				{
					//if the value id different from others provided, add to the list of 
					//values and creates a new Column with its value.
					columnXValues.Add(columnXTemp);
					returnTable.Columns.Add(columnXTemp);
				}
				else
				{
					//Throw exception for a repeated value
					throw new Exception("The inversion used must have " +
															"unique values for column " + columnX);
				}
			}

			//Add a line for each column of the DataTable

			foreach (DataColumn dc in table.Columns)
			{
				if (
						!listColumnsToIgnore.Contains(dc.ColumnName))
				{
					DataRow dr = returnTable.NewRow();
					dr[0] = dc.ColumnName;
					returnTable.Rows.Add(dr);
				}
			}

			//Complete the datatable with the values
			for (int i = 0; i < returnTable.Rows.Count; i++)
			{
				for (int j = 1; j < returnTable.Columns.Count; j++)
				{
					returnTable.Rows[i][j] =
						table.Rows[j - 1][returnTable.Rows[i][0].ToString()].ToString();
				}
			}

			return returnTable;
		}

		public static List<T> ConvertDataTable<T>(DataTable dt)
		{
			List<T> data = new List<T>();
			foreach (DataRow row in dt.Rows)
			{
				T item = GetItem<T>(row);
				data.Add(item);
			}
			return data;
		}

		public static DataTable ConvertListToDatatable<T>(List<T> data)
		{
			PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
			DataTable table = new DataTable();
			for (int i = 0; i < props.Count; i++)
			{
				PropertyDescriptor prop = props[i];
				if (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
					table.Columns.Add(prop.Name, prop.PropertyType.GetGenericArguments()[0]);
				else
					table.Columns.Add(prop.Name, prop.PropertyType);
			}
			object[] values = new object[props.Count];
			foreach (T item in data)
			{
				for (int i = 0; i < values.Length; i++)
				{
					values[i] = props[i].GetValue(item);
				}
				table.Rows.Add(values);
			}
			return table;
		}

		private static T GetItem<T>(DataRow dr)
		{
			Type temp = typeof(T);
			T obj = Activator.CreateInstance<T>();

			foreach (DataColumn column in dr.Table.Columns)
			{
				foreach (PropertyInfo pro in temp.GetProperties())
				{
					if (pro.Name == column.ColumnName)
						pro.SetValue(obj, dr[column.ColumnName], null);
					else
						continue;
				}
			}
			return obj;
		}

		public static XmlDocument ConvertToXml(Object list)
		{
			XmlDocument xmlDoc = new XmlDocument();
			XmlSerializer xmlSerializer = new XmlSerializer(list.GetType());
			using (MemoryStream xmlStream = new MemoryStream())
			{
				xmlSerializer.Serialize(xmlStream, list);
				xmlStream.Position = 0;
				xmlDoc.Load(xmlStream);
				return xmlDoc;
			}
		}

		public static string ToXml(DataTable table, int metaIndex = 0)
		{
			XDocument xdoc = new XDocument(
					new XElement(table.TableName,
							from column in table.Columns.Cast<DataColumn>()
							where column != table.Columns[metaIndex]
							select new XElement(column.ColumnName,
									from row in table.AsEnumerable()
									select new XElement(row.Field<string>(metaIndex), row[column])
									)
							)
					);

			return xdoc.ToString();
		}

		public static bool SendOTPCode(string mobile, string message)
		{
			HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://login.redsms.in/API/SendMessage.ashx?user=dhavalpokiya&password=pokiya155&phone=" + mobile.Trim() + "&text=" + message + "&type=t&senderid=DBCACC");
			HttpWebResponse response = (HttpWebResponse)request.GetResponse();
			Stream stream = response.GetResponseStream();
			StreamReader reader = new StreamReader(stream);
			string result = reader.ReadToEnd();
			reader.Close();
			if (result.Contains("sent"))
			{
				return true;
			}
			else
			{
				return false;
			}
			//return !result.Contains("<error-code>");
		}

		public static int RendomNumber()
		{
			Random rnd = new Random();
			return rnd.Next(100000, 999999);
		}

		public static String Encrypt(string toEncrypt, bool useHashing)
		{
			byte[] keyArray;
			byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);
			//  Dim toEncryptArray As Byte() = UTF32Encoding.UTF32.GetBytes(toEncrypt)
			System.Configuration.AppSettingsReader settingsReader = new AppSettingsReader();
			//  Get the key from config file
			string key = Convert.ToString((settingsReader.GetValue("SecurityKey", typeof(String))));


			// key = "AdeF5ty6Fr456Mw###"
			// System.Windows.Forms.MessageBox.Show(key)
			if (useHashing)
			{
				MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
				keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
				// keyArray = hashmd5.ComputeHash(UTF32Encoding.UTF32.GetBytes(key))
				hashmd5.Clear();
			}
			else
			{
				keyArray = UTF8Encoding.UTF8.GetBytes(key);
				// keyArray = UTF32Encoding.UTF32.GetBytes(key)
			}
			TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
			tdes.Key = keyArray;
			tdes.Mode = CipherMode.ECB;
			tdes.Padding = PaddingMode.PKCS7;
			ICryptoTransform cTransform = tdes.CreateEncryptor();
			byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
			tdes.Clear();
			return Convert.ToBase64String(resultArray, 0, resultArray.Length);
		}

		public static String Decrypt(string cipherString, bool useHashing)
		{
			byte[] keyArray;
			byte[] toEncryptArray = Convert.FromBase64String(cipherString);
			System.Configuration.AppSettingsReader settingsReader = new AppSettingsReader();
			// Get your key from config file to open the lock!
			string key = Convert.ToString((settingsReader.GetValue("SecurityKey", typeof(String))));

			if (useHashing)
			{
				MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
				keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
				// keyArray = hashmd5.ComputeHash(UTF32Encoding.UTF32.GetBytes(key))
				hashmd5.Clear();
			}
			else
			{
				keyArray = UTF8Encoding.UTF8.GetBytes(key);
				// keyArray = UTF32Encoding.UTF32.GetBytes(key)
			}
			TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
			tdes.Key = keyArray;
			tdes.Mode = CipherMode.ECB;
			tdes.Padding = PaddingMode.PKCS7;
			ICryptoTransform cTransform = tdes.CreateDecryptor();
			byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
			tdes.Clear();
			return UTF8Encoding.UTF8.GetString(resultArray);
		}

		public static DataTable GetExcelfiledata(string filePath)
		{
			string strcon = string.Empty;
			string StrFileType = Path.GetExtension(filePath);
			if (StrFileType == ".xlsp")
			{
				//strcon = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source="
				//                + filePath +
				//                ";Extended Properties=\"Excel 8.0;HDR=YES;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";
			}
			else
			{
				strcon = @"Provider=Microsoft.ACE.OLEDB.12.0;";
				strcon += @"Data Source=" + filePath + ";";
				strcon += @"Extended Properties=""Excel 12.0 xml;HDR=YES;Imex=1;""";
				strcon = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source="
											+ filePath +
											";Extended Properties=\"Excel 12.0 xml;HDR=YES;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";

				strcon = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filePath +
											";Extended Properties=\"Excel 12.0 xml;HDR=YES;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";
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

		public static DataTable ConvertJSONstringToDatatable(string json)
		{
			var jsonLinq = JObject.Parse(json);

			// Find the first array using Linq
			var srcArray = jsonLinq.Descendants().Where(d => d is JArray).First();
			var trgArray = new JArray();
			foreach (JObject row in srcArray.Children<JObject>())
			{
				var cleanRow = new JObject();
				foreach (JProperty column in row.Properties())
				{
					// Only include JValue types
					if (column.Value is JValue)
					{
						cleanRow.Add(column.Name, column.Value);
					}
				}

				trgArray.Add(cleanRow);
			}

			return JsonConvert.DeserializeObject<DataTable>(trgArray.ToString());
		}


		public static DataTable GetDataTableFromCsv111(string path)
		{
			string header = "YES";

			string pathOnly = Path.GetDirectoryName(path);
			string fileName = Path.GetFileName(path);
			using (OleDbConnection connection = new OleDbConnection(@"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + pathOnly + ";Extended Properties=\"Text;HDR=" + header + "\""))
			{
				connection.Open();
				DataTable dt = new DataTable();
				DataTable dtSheetNames = connection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
				if (dtSheetNames == null)
				{
					return null;
				}
				string strselect = "Select * from [" + dtSheetNames.Rows[0]["TABLE_NAME"] + "]";
				using (OleDbCommand command = new OleDbCommand(strselect, connection))
				using (OleDbDataAdapter adapter = new OleDbDataAdapter(command))
				{

					dt.Locale = CultureInfo.CurrentCulture;
					adapter.Fill(dt);
					return dt;
				}
			}
		}

		public static DataTable GetExcelfiledata1(string filePath)
		{
			string strcon = string.Empty;
			string StrFileType = Path.GetExtension(filePath);
			if (StrFileType == ".xlsp")
			{
				//strcon = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source="
				//                + filePath +
				//                ";Extended Properties=\"Excel 8.0;HDR=YES;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";
			}
			else
			{
				strcon = @"Provider=Microsoft.ACE.OLEDB.12.0;";
				strcon += @"Data Source=" + filePath + ";";
				strcon += @"Extended Properties=""Excel 12.0 xml;HDR=NO;Imex=1;""";
				strcon = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source="
											+ filePath +
											";Extended Properties=\"Excel 12.0 xml;HDR=NO;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";

				strcon = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filePath +
											";Extended Properties=\"Excel 12.0 xml;HDR=NO;IMEX=1;TypeGuessRows=0;ImportMixedTypes=Text\"";
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

		public class XMLReader
		{
			public List<commanprop> Product_Comman_Type(String type)
			{
				List<commanprop> _prop = new List<commanprop>();
				string xmlData = HttpContext.Current.Server.MapPath("~/Utility/xml_data/BlueStartStaticData.xml");
				int i = 0;
				XmlNodeList xmlnode;
				XmlDataDocument xmldoc = new XmlDataDocument();
				System.IO.FileStream fs = new System.IO.FileStream(xmlData, System.IO.FileMode.Open, System.IO.FileAccess.Read);
				xmldoc.Load(fs);
				xmlnode = xmldoc.GetElementsByTagName(type.ToString());
				for (i = 0; i <= xmlnode.Count - 1; i++)
				{
					//  xmlnode[i].ChildNodes.Item(0).InnerText.Trim();
					_prop.Add(new commanprop() { id = Convert.ToInt32(xmlnode[i].ChildNodes.Item(0).InnerText.Trim()), name = xmlnode[i].ChildNodes.Item(1).InnerText.Trim(), type = xmlnode[i].ChildNodes.Item(2).InnerText.Trim() });
				}
				fs.Close();
				fs.Dispose();
				return _prop;
			}
		}

		[Serializable]
		[XmlRoot("Product_Comman_Type"), XmlType("Product_Comman_Type")]
		public class commanprop
		{
			public int id { set; get; }
			public string name { set; get; }
			public string type { set; get; }
		}

		public static String GetProperStrings(String[] StoneIDs)
		{
			//if (StoneIDs.len == null)
			//    StoneIDs = "";


			// String[] StrIDs = StoneIDs.Split(',');
			String retrunstr = "";

			foreach (string s in StoneIDs)
			{
				if (s.Trim().Length > 0)
				{
					if (StoneIDs.Length > 1)
					{ retrunstr += "'" + s.ToString() + "',"; }
					else
					{ retrunstr += "'" + s.ToString() + "'"; }
				}
			}

			if (StoneIDs.Length > 1)
				return retrunstr.Substring(0, retrunstr.Length - 1);
			else
				return retrunstr;

		}

		public static String GetProperStrings(String StoneIDs)
		{
			if (StoneIDs == null)
				StoneIDs = "";


			String[] StrIDs = StoneIDs.Split(',');
			String retrunstr = "";

			foreach (string s in StrIDs)
			{
				if (s.Trim().Length > 0)
				{
					if (StrIDs.Length > 1)
					{ retrunstr += "'" + s.ToString() + "',"; }
					else
					{ retrunstr += "'" + s.ToString() + "'"; }
				}
			}

			if (StrIDs.Length > 1)
				return retrunstr.Substring(0, retrunstr.Length - 1);
			else
				return retrunstr;

		}

		public static string DataTableToJSONWithJSONNet(DataTable table)
		{
			string JSONString = string.Empty;
			JSONString = JsonConvert.SerializeObject(table);
			return JSONString;
		}


		public static IEnumerable<dynamic> AsDynamicEnumerable(DataTable table)
		{
			// Validate argument here..

			return table.AsEnumerable().Select(row => new DynamicRow(row));
		}

		private sealed class DynamicRow : DynamicObject
		{
			private readonly DataRow _row;

			internal DynamicRow(DataRow row) { _row = row; }

			// Interprets a member-access as an indexer-access on the 
			// contained DataRow.
			public override bool TryGetMember(GetMemberBinder binder, out object result)
			{
				var retVal = _row.Table.Columns.Contains(binder.Name);
				result = retVal ? _row[binder.Name] : null;
				return retVal;
			}
		}



		// DataTable To List Convert All Dynamic Start
		public static List<dynamic> ToDynamicList(DataTable dt, string className)
		{
			return ToDynamicList(ToDictionary(dt), getNewObject(dt.Columns, className));
		}
		private static List<Dictionary<string, object>> ToDictionary(DataTable dt)
		{
			var columns = dt.Columns.Cast<DataColumn>();
			var Temp = dt.AsEnumerable().Select(dataRow => columns.Select(column =>
													 new { Column = column.ColumnName, Value = dataRow[column] })
											 .ToDictionary(data => data.Column, data => data.Value)).ToList();
			return Temp.ToList();
		}
		private static List<dynamic> ToDynamicList(List<Dictionary<string, object>> list, Type TypeObj)
		{
			dynamic temp = new List<dynamic>();
			foreach (Dictionary<string, object> step in list)
			{
				object Obj = Activator.CreateInstance(TypeObj);

				PropertyInfo[] properties = Obj.GetType().GetProperties();

				Dictionary<string, object> DictList = (Dictionary<string, object>)step;

				foreach (KeyValuePair<string, object> keyValuePair in DictList)
				{
					foreach (PropertyInfo property in properties)
					{
						if (property.Name == keyValuePair.Key)
						{
							if (keyValuePair.Value != null && keyValuePair.Value.GetType() != typeof(System.DBNull))
							{
								if (keyValuePair.Value.GetType() == typeof(System.Guid))
								{
									property.SetValue(Obj, keyValuePair.Value, null);
								}
								else
								{
									property.SetValue(Obj, keyValuePair.Value, null);
								}
							}
							break;
						}
					}
				}
				temp.Add(Obj);
			}
			return temp;
		}
		private static Type getNewObject(DataColumnCollection columns, string className)
		{
			AssemblyName assemblyName = new AssemblyName();
			assemblyName.Name = "YourAssembly";
			System.Reflection.Emit.AssemblyBuilder assemblyBuilder = Thread.GetDomain().DefineDynamicAssembly(assemblyName, AssemblyBuilderAccess.Run);
			ModuleBuilder module = assemblyBuilder.DefineDynamicModule("YourDynamicModule");
			TypeBuilder typeBuilder = module.DefineType(className, TypeAttributes.Public);

			foreach (DataColumn column in columns)
			{
				string propertyName = column.ColumnName;
				FieldBuilder field = typeBuilder.DefineField(propertyName, column.DataType, FieldAttributes.Public);
				PropertyBuilder property = typeBuilder.DefineProperty(propertyName, System.Reflection.PropertyAttributes.None, column.DataType, new Type[] { column.DataType });
				MethodAttributes GetSetAttr = MethodAttributes.Public | MethodAttributes.HideBySig;
				MethodBuilder currGetPropMthdBldr = typeBuilder.DefineMethod("get_value", GetSetAttr, column.DataType, new Type[] { column.DataType }); // Type.EmptyTypes);
				ILGenerator currGetIL = currGetPropMthdBldr.GetILGenerator();
				currGetIL.Emit(OpCodes.Ldarg_0);
				currGetIL.Emit(OpCodes.Ldfld, field);
				currGetIL.Emit(OpCodes.Ret);
				MethodBuilder currSetPropMthdBldr = typeBuilder.DefineMethod("set_value", GetSetAttr, null, new Type[] { column.DataType });
				ILGenerator currSetIL = currSetPropMthdBldr.GetILGenerator();
				currSetIL.Emit(OpCodes.Ldarg_0);
				currSetIL.Emit(OpCodes.Ldarg_1);
				currSetIL.Emit(OpCodes.Stfld, field);
				currSetIL.Emit(OpCodes.Ret);
				property.SetGetMethod(currGetPropMthdBldr);
				property.SetSetMethod(currSetPropMthdBldr);
			}
			Type obj = typeBuilder.CreateType();
			return obj;
		}
		// DataTable To List Convert All Dynamic End
		//check the image and link data available or not like 404
		public Boolean IsPageExists(string stUrl)
		{
			bool pageExists = true;
			WebRequest request = WebRequest.Create(stUrl);
			request.Method = WebRequestMethods.Http.Head;
			request.Timeout = 15000;
			WebResponse response;
			try
			{
				response = request.GetResponse();
			}
			catch (Exception)
			{
				pageExists = false; //url does not exist
			}
			return pageExists;
		}

	}

}