const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema(
	{
		thumbnail: String,
		company: String,
		price: Number,
		techs: [String],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{
		toJSON: {
			virtuals: true
		}
	}
);

SpotSchema.virtual('thumbnail_url').get(function() {
	return `http://putyouriphere(localhost):3333/files/${this.thumbnail}`;
	//If the thumbnail in APP didn't show put in 'localhost' your IP ADRESS
});

module.exports = mongoose.model('Spot', SpotSchema);
