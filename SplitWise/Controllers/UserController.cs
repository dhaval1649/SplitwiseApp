using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SplitWise.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SplitWise.Controllers
{
    [Route("api/User")]
    public class UserController : Controller
    {
        SplitWiseContext db;
        public UserController(SplitWiseContext db)
        {
            this.db = db;
        }
        // GET: api/<controller>
        [HttpPost]
        [Route("GetUsers")]
        public IEnumerable<Users> GetUsers([FromBody]Users user)
        {
            var usersList = new List<int>();
            usersList.Add(user.UserId);
            usersList.AddRange(db.UserFriends.Where(w => w.UserOneId == user.UserId).Select(s => s.UserTwoId ?? 0).Distinct());
            usersList.RemoveAll(r => r == 0);

            if (user.Name != "")
            {
                return db.Users.Where(x => !usersList.Any(a => a == x.UserId) && (x.Name.Contains(user.Name) || x.Email.Contains(user.Name)));
            }
            else
            {
                return db.Users.Where(w => !usersList.Any(a => a == w.UserId));
            }
        }

        [HttpPost]
        [Route("GetFriends")]
        public IEnumerable<Users> GetFriends([FromBody]Users user)
        {
            var usersList = new List<int>();
            usersList.Add(user.UserId);
            usersList.AddRange(db.UserFriends.Where(w => w.UserOneId == user.UserId).Select(s => s.UserTwoId ?? 0).Distinct());
            usersList.RemoveAll(r => r == 0);

            if (user.Name != "")
            {
                return db.Users.Where(x => x.UserId != user.UserId && usersList.Any(a => a == x.UserId) && (x.Name.Contains(user.Name) || x.Email.Contains(user.Name)));
            }
            else
            {
                return db.Users.Where(w => w.UserId != user.UserId && usersList.Any(a => a == w.UserId));
            }
        }
        [HttpPost]
        [Route("GetAllFriends")]
        public IEnumerable<Users> GetAllFriends([FromBody]Users user)
        {
            var usersList = new List<int>();
            usersList.Add(user.UserId);
            usersList.AddRange(db.UserFriends.Where(w => w.UserOneId == user.UserId).Select(s => s.UserTwoId ?? 0).Distinct());
            usersList.RemoveAll(r => r == 0);

            return db.Users.Where(w => usersList.Any(a => a == w.UserId));
        }
        [HttpPost]
        [Route("GetAllGroups")]
        public IEnumerable<Group> GetAllGroups([FromBody]Users user)
        {
            var groupList = new List<int>();
            groupList.Add(user.UserId);
            groupList.AddRange(db.GroupMembers.Where(w => w.Userid == user.UserId).Select(s => s.GroupId ?? 0).Distinct());
            groupList.RemoveAll(r => r == 0);

            return db.Group.Where(w => groupList.Any(a => a == w.GroupId));
        }
        [HttpPost]
        [Route("GetUserSettlement")]
        public IEnumerable<Users> GetUserSettlement([FromBody]Group group)
        {

            var groupList = new List<int>();
            //groupList.Add(group.GroupId);
            groupList.AddRange(db.GroupMembers.Where(w => w.GroupId == group.GroupId && w.Userid != group.CreatedBy).Select(s => s.Userid ?? 0).Distinct());
            groupList.RemoveAll(r => r == 0);
            if (group.CreatedBy != null)
            {
                groupList.Remove(group.CreatedBy ?? 0);
            }

            return db.Users.Where(w => groupList.Any(a => a == w.UserId)).Select(x => new UserModel
            {
                Name = x.Name,
                UserId = x.UserId,
                SettlementAmount = (db.AmtDistribution.Where(y => y.UserId == group.CreatedBy && y.ToUserId == x.UserId && y.Expense.Groupid == group.GroupId).Sum(y => y.RemainingAmount) ?? 0)
                                   - (db.Payment.Where(z => z.FromUserid == x.UserId && z.ToUserId == group.CreatedBy && z.GroupId == group.GroupId).Sum(z => z.Amount) ?? 0)
                                   + (db.Payment.Where(z => z.FromUserid == group.CreatedBy && z.ToUserId == x.UserId && z.GroupId == group.GroupId).Sum(z => z.Amount) ?? 0),
                SettlementAmount1 = db.Payment.Where(z => z.FromUserid == group.CreatedBy && z.ToUserId == x.UserId && z.GroupId == group.GroupId).Sum(z => z.Amount) ?? 0,
                SettlementAmount2 = db.Payment.Where(z => z.FromUserid == x.UserId && z.ToUserId == group.CreatedBy && z.GroupId == group.GroupId).Sum(z => z.Amount) ?? 0,
                SettlementAmount3 = (db.AmtDistribution.Where(y => y.UserId == group.CreatedBy && y.ToUserId == x.UserId && y.Expense.Groupid == group.GroupId).Sum(y => y.RemainingAmount) ?? 0),
            });
        }
        [HttpPost]
        [Route("GetFriendsSettlement")]
        public IEnumerable<Users> GetFriendsSettlement([FromBody]Users user)
        {
            var usersList = new List<int>();
            usersList.Add(user.UserId);
            usersList.AddRange(db.UserFriends.Where(w => w.UserOneId == user.UserId).Select(s => s.UserTwoId ?? 0).Distinct());
            usersList.RemoveAll(r => r == 0);

            return db.Users.Where(w => usersList.Any(a => a == w.UserId)).Select(x => new UserModel
            {
                Name = x.Name,
                UserId = x.UserId,
                SettlementAmount = (db.AmtDistribution.Where(y => y.UserId == user.UserId && y.ToUserId == x.UserId && y.Expense.Groupid == null).Sum(y => y.RemainingAmount) ?? 0)
                                  - (db.Payment.Where(z => z.FromUserid == x.UserId && z.ToUserId == user.UserId && z.GroupId == null).Sum(z => z.Amount) ?? 0)
                                  + (db.Payment.Where(z => z.FromUserid == user.UserId && z.ToUserId == x.UserId && z.GroupId == null).Sum(z => z.Amount) ?? 0),
                //SettlementAmount1 = db.Payment.Where(z => z.FromUserid == user.UserId && z.ToUserId == x.UserId && z.GroupId == null).Sum(z => z.Amount) ?? 0,
                //SettlementAmount2 = db.Payment.Where(z => z.FromUserid == x.UserId && z.ToUserId == user.UserId && z.GroupId == null).Sum(z => z.Amount) ?? 0,
            });
        }
        [HttpPost]
        [Route("GetGroupMemberList")]
        public IEnumerable<Users> GetGroupMemberList([FromBody]Group group)
        {
            var groupList = new List<int>();
            groupList.AddRange(db.GroupMembers.Where(w => w.GroupId == group.GroupId).Select(s => s.Userid ?? 0).Distinct());
            groupList.RemoveAll(r => r == 0);
            if (group.CreatedBy != null)
            {
                groupList.Remove(group.CreatedBy ?? 0);
            }

            return db.Users.Where(w => groupList.Any(a => a == w.UserId)).Select(x => new UserModel
            {
                Name = x.Name,
                UserId = x.UserId,
                SettlementAmount = (db.AmtDistribution.Where(y => y.UserId == x.UserId && y.Expense.Groupid == group.GroupId).Sum(y => y.RemainingAmount) ?? 0)
                                    + (db.Payment.Where(z => (z.FromUserid == x.UserId) && z.GroupId == group.GroupId).Sum(z => z.Amount) ?? 0)
                                    - (db.Payment.Where(z => (z.ToUserId == x.UserId) && z.GroupId == group.GroupId).Sum(z => z.Amount) ?? 0),

            });
        }
        [HttpPost]
        [Route("GetMemberList")]
        public IEnumerable<Users> GetMemberList([FromBody]Users user)
        {
            var usersList = new List<int>();
            usersList.Add(user.UserId);
            usersList.AddRange(db.UserFriends.Where(w => w.UserOneId == user.UserId).Select(s => s.UserTwoId ?? 0).Distinct());
            usersList.RemoveAll(r => r == 0);
            usersList.Remove(user.UserId);

            return db.Users.Where(w => usersList.Any(a => a == w.UserId)).Select(x => new UserModel
            {
                Name = x.Name,
                UserId = x.UserId,
                SettlementAmount = (db.AmtDistribution.Where(y => y.UserId == x.UserId).Sum(y => y.RemainingAmount) ?? 0)
                                    + (db.Payment.Where(z => z.FromUserid == x.UserId).Sum(z => z.Amount) ?? 0)
                                    - (db.Payment.Where(z => z.ToUserId == x.UserId).Sum(z => z.Amount) ?? 0),

            });
        }
        [HttpPost]
        [Route("GetMemberDetails")]
        public List<Users> GetMemberDetails([FromBody]Users user)
        {
            var groupList = new List<int>();
            groupList.Add(user.UserId);
            groupList.AddRange(db.GroupMembers.Where(w => w.Userid == user.UserId).Select(s => s.GroupId ?? 0).Distinct());
            groupList.RemoveAll(r => r == 0);

            List<Users> userList = new List<Users>();
            //Group Expenses and payments
            userList.AddRange(db.Group.Where(w => groupList.Any(a => a == w.GroupId)).Select(x => new UserModel
            {
                Name = x.GroupName,
                UserId = x.GroupId,
                SettlementAmount = (db.AmtDistribution.Where(y => y.UserId == user.UserId && y.Expense.Groupid == x.GroupId).Sum(y => y.RemainingAmount) ?? 0)
                                      + (db.Payment.Where(z => z.FromUserid == user.UserId && z.GroupId == x.GroupId).Sum(z => z.Amount) ?? 0)
                                      - (db.Payment.Where(z => z.ToUserId == user.UserId && z.GroupId == x.GroupId).Sum(z => z.Amount) ?? 0),

            }));
            //Non Group Expenses and payments
            userList.Add(db.Users.Where(w => w.UserId == user.UserId).Select(x => new UserModel
            {
                Name = "Non-group expenses",
                UserId = x.UserId,
                SettlementAmount = (db.AmtDistribution.Where(y => y.UserId == x.UserId && y.Expense.Groupid == null).Sum(y => y.RemainingAmount) ?? 0)
                                     + (db.Payment.Where(z => z.FromUserid == x.UserId && z.GroupId == null).Sum(z => z.Amount) ?? 0)
                                     - (db.Payment.Where(z => z.ToUserId == x.UserId && z.GroupId == null).Sum(z => z.Amount) ?? 0),

            }).FirstOrDefault());

            return userList;
        }
        [HttpPost]
        [Route("GetUserSettlementDetails")]
        public Users GetUserSettlementDetails([FromBody]Users user)
        {


            return db.Users.Where(w => w.UserId == user.UserId).Select(x => new UserModel
            {
                Name = x.Name,
                UserId = x.UserId,
                SettlementAmount = (db.AmtDistribution.Where(y => y.UserId == x.UserId).Sum(y => y.RemainingAmount) ?? 0)
                                      + (db.Payment.Where(z => z.FromUserid == x.UserId).Sum(z => z.Amount) ?? 0)
                                      - (db.Payment.Where(z => z.ToUserId == x.UserId).Sum(z => z.Amount) ?? 0),
                GetBackAmount = (db.AmtDistribution.Where(y => y.UserId == x.UserId && y.RemainingAmount > 0).Sum(y => y.RemainingAmount) ?? 0)
                                      // + (db.Payment.Where(z => z.FromUserid == x.UserId).Sum(z => z.Amount) ?? 0)
                                      - (db.Payment.Where(z => z.ToUserId == x.UserId).Sum(z => z.Amount) ?? 0),
                OweAmount = (db.AmtDistribution.Where(y => y.UserId == x.UserId && y.RemainingAmount < 0).Sum(y => y.RemainingAmount) ?? 0)
                                      + (db.Payment.Where(z => z.FromUserid == x.UserId).Sum(z => z.Amount) ?? 0)
                // - (db.Payment.Where(z => z.ToUserId == x.UserId).Sum(z => z.Amount) ?? 0),

            }).FirstOrDefault();
        }
        [HttpPost]
        [Route("GetGroupDetail")]
        public Group getGroupDetail([FromBody]Group group)
        {
            return db.Group.SingleOrDefault(w => w.GroupId == group.GroupId);
        }
        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get([FromBody]Users user)
        {
            return "value";
        }

        // POST api/<controller>
        [HttpPost]
        [Route("Login")]
        public int Login([FromBody]Users user)
        {
            return db.Users.FirstOrDefault(x => x.Email == user.Email && x.Password == user.Password) == null ? 0 : db.Users.FirstOrDefault(x => x.Email == user.Email && x.Password == user.Password).UserId;
        }

        // Post api/<controller>
        [HttpPost]
        public int Register([FromBody]Users user)
        {
            user.RegisteredDate = DateTime.Now;
            db.Users.Add(user);
            return db.SaveChanges();
        }
        [HttpPost]
        [Route("AddFriend")]
        public int AddFriend([FromBody]UserFriends userFriends)
        {
            userFriends.AddedDate = DateTime.Now;
            userFriends.UpdatedDate = DateTime.Now;
            db.UserFriends.Add(userFriends);
            return db.SaveChanges();
        }
        [HttpPost]
        [Route("AddGroup")]
        public int AddGroup([FromBody]Group group)
        {
            group.AddedDate = DateTime.Now;

            GroupMembers gm = new GroupMembers();
            gm.Userid = group.CreatedBy;
            group.GroupMembers.Add(gm);

            foreach (var member in group.GroupMembers)
            {
                member.CreatedBy = group.CreatedBy;
            }

            db.Group.Add(group);
            return db.SaveChanges();

        }
        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
