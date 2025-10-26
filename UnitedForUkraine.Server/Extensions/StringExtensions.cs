namespace UnitedForUkraine.Server.Extensions;

public static class StringExtensions
{
    public static string FirstCharacterToUpper(this string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        return string.Concat(input[0].ToString().ToUpper(), input.AsSpan(1));
    }
}