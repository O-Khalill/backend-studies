import { sequelize } from "../DB/connection.db.js";
import { DataTypes, Model } from "sequelize";

class Comment extends Model {}

Comment.init(
	{
		content: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		sequelize,
		tableName: "comments",
	},
);
export default Comment;
