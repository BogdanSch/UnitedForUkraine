using FluentEmail.Core.Models;

namespace UnitedForUkraine.Server.Helpers
{
    public record EmailMetadata(string ToAddress, string Subject, string Body = "", string AttachmentPath = "", Attachment[]? Attachments = null);
}
