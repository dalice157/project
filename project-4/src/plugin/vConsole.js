import VConsole from "vconsole";
const vConsole = process.env.NODE_ENV !== "production" ? new VConsole() : "";
export default vConsole;
