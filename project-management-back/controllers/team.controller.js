import TeamMember from "../models/member.model.js";
import Team from "../models/team.model.js";

export const list = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const team = await Team.findById(teamId).populate("members");

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    const leader = await TeamMember.findById(team.leaderId);

    const membersList = team.members.map(m => m.toObject());

    // تضمين القائد في أول القائمة لو مش موجود
    if (leader && !membersList.find(m => m._id.equals(leader._id))) {
      membersList.unshift(leader.toObject());
    }

    res.json(membersList);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const add = async (req, res) => {
  try {
    const m = await TeamMember.create(req.body);
    res.json(m);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const checkCode = async (req, res) => {
  try {
    const teamCode = req.params.code.toUpperCase();
    const teamExists = await Team.exists({ code: teamCode });
    res.json({ exists: !!teamExists });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
