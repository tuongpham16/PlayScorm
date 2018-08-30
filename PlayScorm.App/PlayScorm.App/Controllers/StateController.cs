using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PlayScorm.App.Models;

namespace PlayScorm.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : ControllerBase
    {

        [HttpGet("{packageId}")]
        public  IActionResult GetState(string packageId)
        {
            var filePath = Path.Combine("data", $"{packageId}.dat");
            if (System.IO.File.Exists(filePath))
            {
                return Ok(JsonConvert.DeserializeObject<ScormStateValueViewModel>(System.IO.File.ReadAllText(filePath)));
            }
            return Ok(default(ScormStateValueViewModel));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateScormState([FromBody] ScormStateValueViewModel vm)
        {
            var filePath = Path.Combine("data", $"{vm.PackageId}.dat");
            if(!System.IO.File.Exists(filePath))
            {
                using (var fs = System.IO.File.Create(filePath))
                {
                    fs.Close();
                }

            }
            await System.IO.File.WriteAllTextAsync(filePath, JsonConvert.SerializeObject(vm));
            return Ok();
        }

        [HttpPost("timespent")]
        public async Task<IActionResult> UpdateScormTimeSpent([FromBody] ScormTimespentViewModel vm)
        {
            if (vm == null)
                return BadRequest();

            var filePath = Path.Combine("data", $"{vm.PackageId}-time.dat");
            if (!Directory.Exists(filePath))
            {
                using (var fs = System.IO.File.Create(filePath))
                {
                    fs.Close();
                }
            }
            await System.IO.File.WriteAllTextAsync(filePath, JsonConvert.SerializeObject(vm));
            return Ok();
        }
    }
}