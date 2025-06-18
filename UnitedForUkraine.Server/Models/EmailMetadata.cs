namespace UnitedForUkraine.Server.Models
{
    public class EmailMetadata(string toAddress, string subject, string body = "",
        string attachmentPath = "")
    {
        public string ToAddress { get; set; } = toAddress;
        public string Subject { get; set; } = subject;
        public string Body { get; set; } = body;
        public string? AttachmentPath { get; set; } = attachmentPath;
    }
}
