namespace UnitedForUkraine.Server.Models
{
    public record EmailMetadata(string ToAddress, string Subject, string Body = "", string AttachmentPath = "");
}
