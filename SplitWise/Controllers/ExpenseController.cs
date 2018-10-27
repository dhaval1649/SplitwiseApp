using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SplitWise.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SplitWise.Controllers
{

    [Route("api/Expense")]
    public class ExpenseController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        public ExpenseController(IHostingEnvironment env)
        {
            _hostingEnvironment = env;
        }

        SplitWiseContext db = new SplitWiseContext();
        [HttpGet]
        [Route("GetAllCategory")]
        public IEnumerable<Category1> GetAllCategory()
        {
            return db.Category1.OrderBy(x => x.Title);
        }

        [HttpPost]
        [Route("GetSubCategory")]
        public IEnumerable<Category2> GetSubCategory([FromBody]Category1 category)
        {
            return db.Category2.Where(x => x.Category1Id == category.Category1Id).OrderBy(x => x.Title);
        }
        [HttpPost]
        [Route("SaveExpense")]
        public int SaveExpense([FromBody]Expense expense)
        {
            db.Expense.Add(expense);
            db.SaveChanges();
            return 0;
        }
        [HttpPost]
        [Route("UpateExpense")]
        public int UpateExpense([FromBody]Expense expense)
        {
            db.Expense.Update(expense);
            return db.SaveChanges();

        }
        [HttpPost]
        [Route("UpatePayment")]
        public int UpatePayment([FromBody]Payment payment)
        {
            db.Payment.Update(payment);
            return db.SaveChanges();

        }

        [HttpPost]
        [Route("DeleteExpense")]
        public int DeleteExpense([FromBody]Expense expense)
        {
            List<ExpenseDistribution> expenseDistributions = db.ExpenseDistribution.Where(x => x.ExpenseId == expense.ExpenseId).ToList();
            db.ExpenseDistribution.RemoveRange(expenseDistributions);
            List<PaidByUser> paidByUsers = db.PaidByUser.Where(x => x.ExpenseId == expense.ExpenseId).ToList();
            db.PaidByUser.RemoveRange(paidByUsers);
            List<AmtDistribution> amtDistributions = db.AmtDistribution.Where(x => x.ExpenseId == expense.ExpenseId).ToList();
            db.AmtDistribution.RemoveRange(amtDistributions);
            Expense exp = db.Expense.FirstOrDefault(x => x.ExpenseId == expense.ExpenseId);
            db.Expense.Remove(exp);
            return db.SaveChanges();

        }
        [HttpPost]
        [Route("GetGroupExpenses")]
        public List<ExpensePaymentModel> GetGroupExpenses([FromBody]Expense expense)
        {

            List<ExpensePaymentModel> expenseList = new List<ExpensePaymentModel>();


            List<ExpenseModel> exp = db.Expense.Where(x =>
            (expense.Groupid != null ? x.Groupid == expense.Groupid : x.ExpenseDistribution.Where(y => y.UserId == expense.Owndby && y.Expense.Groupid == null).Count() > 0 && x.Groupid == null)).Select(x => new ExpenseModel
            {
                ExpenseId = x.ExpenseId,
                PaidByName = x.PaidByNavigation.Name,
                PaidByCount = x.PaidByUser.Where(w => w.PaidAmount > 0).Count(),
                PaidBy = x.PaidBy,
                ExpenseDate = x.ExpenseDate,
                Description = x.Description,
                Amount = x.Amount,
                SettlementAmount = x.PaidBy > 0 && x.PaidBy == expense.Owndby ?
                                              (x.Amount - x.ExpenseDistribution.Where(y => y.UserId == expense.Owndby && y.ExpenseId == x.ExpenseId).Sum(s => s.ShareAmount)) :
                                              x.PaidBy > 0 && x.PaidBy != expense.Owndby ? (0 - x.ExpenseDistribution.Where(y => y.UserId == expense.Owndby && y.ExpenseId == x.ExpenseId).Sum(s => s.ShareAmount)) :
                                              (x.PaidByUser.FirstOrDefault(y => y.UserId == expense.Owndby).RemainingAmount),

            }).OrderByDescending(x => x.ExpenseDate).OrderByDescending(x => x.ExpenseId).ToList();

            foreach (ExpenseModel e in exp)
            {
                ExpensePaymentModel epm = new ExpensePaymentModel()
                {
                    ExpenseId = e.ExpenseId,
                    PaidByName = e.PaidByName,
                    PaidByCount = e.PaidByCount,
                    PaidBy = e.PaidBy,
                    ExpenseDate = e.ExpenseDate,
                    Description = e.Description,
                    Amount = e.Amount,
                    SettlementAmount = e.SettlementAmount,
                    PaymentId = 0,
                };

                expenseList.Add(epm);
            }
            List<PaymentModel> paidamnt = db.Payment.Where(x =>
            (expense.Groupid != null ? x.GroupId == expense.Groupid : (x.FromUserid == expense.Owndby || x.ToUserId == expense.Owndby) && x.GroupId == null)).Select(x => new PaymentModel
            {
                PaymentId = x.PaymentId,
                FromUserid = x.FromUserid,
                ToUserId = x.ToUserId,
                Amount = x.Amount,
                PaymentDate = x.PaymentDate,
                paidToName = x.ToUser.Name,
                PaidByName = x.FromUser.Name
            }).ToList();
            foreach (PaymentModel p in paidamnt)
            {
                ExpensePaymentModel epm = new ExpensePaymentModel()
                {
                    PaymentId = p.PaymentId,
                    FromUserid = p.FromUserid,
                    ToUserId = p.ToUserId,
                    Amount = p.Amount,
                    ExpenseDate = p.PaymentDate,
                    paidToName = p.paidToName,
                    PaidByName = p.PaidByName,
                    ExpenseId = 0,
                };
                expenseList.Add(epm);
            }
            return expenseList.OrderByDescending(x => x.ExpenseDate).ToList();
        }
        [HttpPost]
        [Route("GetUserExpenseList")]
        public List<ExpensePaymentModel> GetUserExpenseList([FromBody]Expense expense)
        {

            List<ExpensePaymentModel> expenseList = new List<ExpensePaymentModel>();


            List<ExpenseModel> exp = db.Expense.Where(x =>
             x.ExpenseDistribution.Where(y => y.UserId == expense.Owndby && y.Expense.Groupid == null).Count() > 0).Select(x => new ExpenseModel
             {
                 ExpenseId = x.ExpenseId,
                 PaidByName = x.PaidByNavigation.Name,
                 PaidByCount = x.PaidByUser.Where(w => w.PaidAmount > 0).Count(),
                 PaidBy = x.PaidBy,
                 ExpenseDate = x.ExpenseDate,
                 Description = x.Description,
                 Amount = x.Amount,
                 SettlementAmount = x.PaidBy > 0 && x.PaidBy == expense.Owndby ?
                                             (x.Amount - x.ExpenseDistribution.Where(y => y.UserId == expense.Owndby && y.ExpenseId == x.ExpenseId).Sum(s => s.ShareAmount)) :
                                             x.PaidBy > 0 && x.PaidBy != expense.Owndby ? (0 - x.ExpenseDistribution.Where(y => y.UserId == expense.Owndby && y.ExpenseId == x.ExpenseId).Sum(s => s.ShareAmount)) :
                                             (x.PaidByUser.FirstOrDefault(y => y.UserId == expense.Owndby).RemainingAmount),

             }).OrderByDescending(x => x.ExpenseDate).OrderByDescending(x => x.ExpenseId).ToList();

            foreach (ExpenseModel e in exp)
            {
                ExpensePaymentModel epm = new ExpensePaymentModel()
                {
                    ExpenseId = e.ExpenseId,
                    PaidByName = e.PaidByName,
                    PaidByCount = e.PaidByCount,
                    PaidBy = e.PaidBy,
                    ExpenseDate = e.ExpenseDate,
                    Description = e.Description,
                    Amount = e.Amount,
                    SettlementAmount = e.SettlementAmount,
                    PaymentId = 0,
                };

                expenseList.Add(epm);
            }
            List<PaymentModel> paidamnt = db.Payment.Where(x =>
            x.FromUserid == expense.Owndby || x.ToUserId == expense.Owndby).Select(x => new PaymentModel
            {
                PaymentId = x.PaymentId,
                FromUserid = x.FromUserid,
                ToUserId = x.ToUserId,
                Amount = x.Amount,
                PaymentDate = x.PaymentDate,
                paidToName = x.ToUser.Name,
                PaidByName = x.FromUser.Name
            }).ToList();
            foreach (PaymentModel p in paidamnt)
            {
                ExpensePaymentModel epm = new ExpensePaymentModel()
                {
                    PaymentId = p.PaymentId,
                    FromUserid = p.FromUserid,
                    ToUserId = p.ToUserId,
                    Amount = p.Amount,
                    ExpenseDate = p.PaymentDate,
                    paidToName = p.paidToName,
                    PaidByName = p.PaidByName,
                    ExpenseId = 0,
                };
                expenseList.Add(epm);
            }
            return expenseList.OrderByDescending(x => x.ExpenseDate).ToList();
        }
        [HttpPost]
        [Route("GetExpenseDetail")]
        public ExpenseModel GetExpenseDetail([FromBody]Expense expense)
        {
            var expenseDetail = db.Expense.FirstOrDefault(x => x.ExpenseId == expense.ExpenseId);
            ExpenseModel expenseModel = new ExpenseModel()
            {
                Category2 = expenseDetail.Category2,
                Category1Id = db.Category2.FirstOrDefault(x => x.Category2Id == expenseDetail.Category2).Category1Id,
                Description = expenseDetail.Description,
                Amount = expenseDetail.Amount,
                PaidBy = expenseDetail.PaidBy,
                SplitEqually = expenseDetail.SplitEqually,
                ExpenseDate = expenseDetail.ExpenseDate,
                Attachment = expenseDetail.Attachment,
                Notes = expenseDetail.Notes,
                ExpenseDistributionModel = db.ExpenseDistribution.Where(y => y.ExpenseId == expenseDetail.ExpenseId).Select(y => new ExpenseDistributionModel
                {
                    ExpenseDistributionId = y.ExpenseDistributionId,
                    ExpenseId = y.ExpenseId,
                    UserId = y.UserId,
                    ShareAmount = y.ShareAmount,
                    Share = y.Share,
                }).ToList(),
                PaidByUserModel = db.PaidByUser.Where(y => y.ExpenseId == expenseDetail.ExpenseId).Select(y => new PaidByUserModel
                {
                    PaidByUserId = y.PaidByUserId,
                    ExpenseId = y.ExpenseId,
                    UserId = y.UserId,
                    PaidAmount = y.PaidAmount,
                }).ToList()
            };

            return expenseModel;
        }
        [HttpPost]
        [Route("GetPaymentDetails")]
        public PaymentModel GetPaymentDetails([FromBody]Payment payment)
        {

            PaymentModel paidamnt = db.Payment.Where(x => x.PaymentId == payment.PaymentId).Select(x => new PaymentModel
            {
                PaymentId = x.PaymentId,
                FromUserid = x.FromUserid,
                ToUserId = x.ToUserId,
                Amount = x.Amount,
                PaymentDate = x.PaymentDate,
                paidToName = x.ToUser.Name,
                PaidByName = x.FromUser.Name,
                Attachment = x.Attachment,
                Notes = x.Notes
            }).FirstOrDefault();

            return paidamnt;
        }



        // GET: api/<controller>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        [HttpPost]
        [Route("SavePayment")]
        public int SavePayment([FromBody]Payment payment)
        {
            payment.UpdatedDate = DateTime.Now;
            if (payment.PaymentId > 0)
            {
                db.Payment.Update(payment);
            }
            else
            {
                db.Payment.Add(payment);
            }
            List<AmtDistribution> amt = db.AmtDistribution.Where(x => x.ToUserId == payment.ToUserId && x.UserId == payment.FromUserid && x.Expense.Groupid == payment.GroupId).ToList();
            foreach (var a in amt)
            {
                a.IsPaid = 1;
            }
            db.AmtDistribution.UpdateRange(amt);

            db.SaveChanges();
            return 0;
        }
        [HttpPost]
        [Route("DeletePayment")]
        public int DeletePayment([FromBody]Payment payment)
        {
            Payment pay = db.Payment.FirstOrDefault(x => x.PaymentId == payment.PaymentId);

            List<AmtDistribution> amt = db.AmtDistribution.Where(x => x.ToUserId == pay.ToUserId && x.UserId == pay.FromUserid && x.Expense.Groupid == pay.GroupId).ToList();
            foreach (var a in amt)
            {
                a.IsPaid = 0;
            }
            db.AmtDistribution.UpdateRange(amt);
            db.Payment.Remove(pay);
            return db.SaveChanges();
            //return 0;
        }
        [HttpPost, DisableRequestSizeLimit]
        [Route("FileUpload")]
        public ActionResult UploadFile(Expense expense)
        {
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Json("Upload Successful.");
            }
            catch (System.Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }
        // POST api/<controller>
        [HttpPost]
        public void Post([FromBody]string value)
        {
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

        private byte[] ToByteArray(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
    }
}
