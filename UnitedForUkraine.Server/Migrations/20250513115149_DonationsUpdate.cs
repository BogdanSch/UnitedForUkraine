using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnitedForUkraine.Server.Migrations
{
    /// <inheritdoc />
    public partial class DonationsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CheckoutSessionId",
                table: "Donations",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckoutSessionId",
                table: "Donations");
        }
    }
}
