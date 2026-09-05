import { sequelize } from "../DB/connection.db.js";
import { DataTypes, Model } from "sequelize";

class Post extends Model {}

Post.init(
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{ timestamps: true, paranoid: true, tableName: "posts", sequelize },
);

export default Post;
