using Microsoft.AspNetCore.Identity;

namespace NotesAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Note> Notes { get; set; }
    }
}
