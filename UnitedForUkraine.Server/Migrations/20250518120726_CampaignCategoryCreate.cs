﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnitedForUkraine.Server.Migrations
{
    /// <inheritdoc />
    public partial class CampaignCategoryCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "Campaigns",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Campaigns");
        }
    }
}
