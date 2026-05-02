import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { SYSTEM_PROMPTS } from "../../config/prompts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsPath = path.join(__dirname, "../../config/prompts.js");

/**
 * Get current system configuration (prompts)
 */
export const getConfiguration = async (req, res) => {
  try {
    // We return the actual object so the UI can iterate over keys
    res.json({
      success: true,
      prompts: SYSTEM_PROMPTS
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update system configuration (prompts)
 */
export const updateConfiguration = async (req, res) => {
  const { prompts } = req.body;

  if (!prompts || typeof prompts !== 'object') {
    return res.status(400).json({ success: false, message: "Invalid prompts data" });
  }

  try {
    // Construct the new file content
    const fileContent = `/**
 * Centralized Prompt Configuration
 * 
 * NOTE: Variables like {{query}}, {{symptoms}}, and {{severity}} will be replaced at runtime.
 */

export const SYSTEM_PROMPTS = {
  CONTROLLER_AGENT: \`${prompts.CONTROLLER_AGENT}\`,

  CLINICAL_AGENT: \`${prompts.CLINICAL_AGENT}\`,

  CHAT_AGENT: \`${prompts.CHAT_AGENT}\`
};
`;

    await fs.writeFile(promptsPath, fileContent, "utf-8");

    res.json({
      success: true,
      message: "Configuration updated successfully. Server may restart to apply changes."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
