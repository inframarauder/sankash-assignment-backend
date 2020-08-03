const { IMG1, IMG2, IMG3 } = process.env;

exports.getDashboard = (req, res) => {
  const { type } = req.user;

  switch (type) {
    case "A":
      return res.status(200).json({ type, images: [IMG1] });
      break;
    case "B":
      return res.status(200).json({ type, images: [IMG1, IMG2] });
      break;
    case "C":
      return res.status(200).json({ type, images: [IMG2, IMG3] });
      break;
    default:
      return res.status(400).json({ error: "Invalid type!" });
  }
};
