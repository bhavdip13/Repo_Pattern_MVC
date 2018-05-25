using Repo_Pattern_MVC_Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo_pattern_MVC_Repository.Service
{
	public interface IHome_Repository : IDisposable
	{
		List<Mst_Country> GetCountry();
		List<Mst_City> GetCity(int StateID);
		List<Mst_State> GetState(int Country_Id);
		bool CheckEmailAlredyregister(string Email);
		int Register(Register Model);
		List<Register> GetRegisterData(string Email, string Password);
	}
}
