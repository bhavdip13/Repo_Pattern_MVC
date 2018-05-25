
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repo_Pattern_MVC_Model;
using Repo_Pattern_MVC_Model.Model;
using Repo_pattern_MVC_Repository.Service;

namespace Repo_pattern_MVC_Repository.ServiceContract
{

	public class Home_Repository : IHome_Repository
	{
		private Repo_Pattern_MVCEntities context;
		public Home_Repository(Repo_Pattern_MVCEntities _context)
		{
			this.context = _context;
		}
		//start your method here...
		public  List<Mst_Country> GetCountry()
		{
			return context.Mst_Country.ToList();
		}
		public List<Mst_State> GetState(int Country_Id)
		{
			return context.Mst_State.Where(t=>t.CountryID==Country_Id).ToList();
		}
		public List<Mst_City> GetCity(int StateID)
		{
			return context.Mst_City.Where(t=>t.StateID== StateID).ToList();
		}
		public bool CheckEmailAlredyregister(string Email)
		{
			bool isValid = !context.Registers.ToList().Exists(p => p.Email.Equals(Email, StringComparison.CurrentCultureIgnoreCase));
			return isValid;
		}
		public int Register(Register Model)
		{
			context.Registers.Add(Model);
			context.SaveChanges();
			return 1;
		}
		public List<Register> GetRegisterData(string Email,string Password)
		{
			return context.Registers.Where(p => p.Email==Email && p.Password==Password).ToList();
			
		}
		//------------------------------------
		private bool disposed = false;
		protected virtual void Dispose(bool disposing)
		{
			if (!this.disposed)
			{
				if (disposing)
				{
					context.Dispose();
				}
			}
			this.disposed = true;
		}
		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}
	}


}
