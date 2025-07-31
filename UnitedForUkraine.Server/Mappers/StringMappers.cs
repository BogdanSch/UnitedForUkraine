namespace UnitedForUkraine.Server.Mappers;

public static class StringMappers
{
    public static string FirstCharacterToUpper(this string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        return string.Concat(input[0].ToString().ToUpper(), input.AsSpan(1));
    }
}