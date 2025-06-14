const {
  Issue,
  User,
  Category,
  Location,
  Multimedia,
  Feedback,
  LocalAuthority,
} = require("../models");
const { Op } = require("sequelize");

const createIssue = async (req, res) => {
  try {
    const { title, description, categoryId, location, multimedia } = req.body;

    let locationId = null;
    if (location) {
      const newLocation = await Location.create(location);
      locationId = newLocation.locationId;
    }

    const issue = await Issue.create({
      title,
      description,
      categoryId,
      locationId,
      submittedByUserId: req.user.userId,
    });

    // Add multimedia if provided
    if (multimedia && multimedia.length > 0) {
      const multimediaData = multimedia.map((file) => ({
        issueId: issue.issueId,
        fileType: file.fileType,
        fileUrl: file.fileUrl,
      }));
      await Multimedia.bulkCreate(multimediaData);
    }

    const createdIssue = await Issue.findByPk(issue.issueId, {
      include: [
        {
          model: User,
          as: "submittedBy",
          attributes: ["username", "firstName", "lastName"],
        },
        { model: Category, as: "category" },
        { model: Location, as: "location" },
        { model: Multimedia, as: "multimedia" },
      ],
    });

    // Get the socket.io instance from the Express app
    const io = req.app.get("socketio");
    if (io) {
      // Emit a 'newIssue' event with the created issue data
      io.emit("newIssue", createdIssue);
      console.log("Emitted newIssue event:", createdIssue.issueId);
    }

    res.status(201).json({
      message: "Issue created successfully",
      issue: createdIssue,
    });
  } catch (error) {
    console.error("Create issue error:", error);
    res.status(500).json({ error: "Failed to create issue" });
  }
};

const getIssues = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      search,
      sortBy = "submissionDate",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const include = [
      {
        model: User,
        as: "submittedBy",
        attributes: ["username", "firstName", "lastName"],
      },
      { model: Category, as: "category" },
      { model: Location, as: "location" },
      { model: Multimedia, as: "multimedia" },
      { model: LocalAuthority, as: "assignedTo", required: false },
    ];

    if (category) {
      include[1].where = { name: category };
    }

    const { count, rows: issues } = await Issue.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get issues error:", error);
    res.status(500).json({ error: "Failed to get issues" });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "submittedBy",
          attributes: ["username", "firstName", "lastName"],
        },
        { model: Category, as: "category" },
        { model: Location, as: "location" },
        { model: Multimedia, as: "multimedia" },
        { model: LocalAuthority, as: "assignedTo", required: false },
        {
          model: Feedback,
          as: "feedback",
          include: [
            { model: User, as: "submittedBy", attributes: ["username"] },
          ],
        },
      ],
    });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ issue });
  } catch (error) {
    console.error("Get issue error:", error);
    res.status(500).json({ error: "Failed to get issue" });
  }
};

const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const issue = await Issue.findByPk(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Check permissions
    if (
      req.user.userRole === "CommunityMember" &&
      issue.submittedByUserId !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this issue" });
    }

    // Set resolution date if status changes to resolved
    if (updateData.status === "Resolved" && issue.status !== "Resolved") {
      updateData.resolutionDate = new Date();
    }

    await issue.update(updateData);

    const updatedIssue = await Issue.findByPk(id, {
      include: [
        {
          model: User,
          as: "submittedBy",
          attributes: ["username", "firstName", "lastName"],
        },
        { model: Category, as: "category" },
        { model: Location, as: "location" },
        { model: Multimedia, as: "multimedia" },
        { model: LocalAuthority, as: "assignedTo", required: false },
      ],
    });

    // Get the socket.io instance from the Express app
    const io = req.app.get("socketio");
    if (io) {
      // Emit an 'issueUpdated' event with the updated issue data
      io.emit("issueUpdated", updatedIssue);
      console.log("Emitted issueUpdated event:", updatedIssue.issueId);
    }

    res.json({
      message: "Issue updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    console.error("Update issue error:", error);
    res.status(500).json({ error: "Failed to update issue" });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByPk(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Check permissions
    if (
      req.user.userRole === "CommunityMember" &&
      issue.submittedByUserId !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this issue" });
    }

    await issue.destroy();

    // Get the socket.io instance from the Express app
    const io = req.app.get("socketio");
    if (io) {
      // Emit an 'issueDeleted' event with the ID of the deleted issue
      io.emit("issueDeleted", id);
      console.log("Emitted issueDeleted event for ID:", id);
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Delete issue error:", error);
    res.status(500).json({ error: "Failed to delete issue" });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      where: { submittedByUserId: req.user.userId },
      include: [
        { model: Category, as: "category" },
        { model: Location, as: "location" },
        { model: Multimedia, as: "multimedia" },
      ],
      order: [["submissionDate", "DESC"]],
    });

    res.json({ issues });
  } catch (error) {
    console.error("Get my issues error:", error);
    res.status(500).json({ error: "Failed to get your issues" });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getMyIssues,
};
