//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Repo_Pattern_MVC_Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class Register
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public Nullable<int> Country_ID { get; set; }
        public Nullable<int> State_ID { get; set; }
        public Nullable<int> City_ID { get; set; }
        public string Password { get; set; }
    }
}