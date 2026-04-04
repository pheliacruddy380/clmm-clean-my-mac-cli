#!/usr/bin/env bash

set -e

# Define color codes for pretty output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo " ██████╗██╗     ███╗   ███╗███╗   ███╗"
echo "██╔════╝██║     ████╗ ████║████╗ ████║"
echo "██║     ██║     ██╔████╔██║██╔████╔██║"
echo "██║     ██║     ██║╚██╔╝██║██║╚██╔╝██║"
echo "╚██████╗███████╗██║ ╚═╝ ██║██║ ╚═╝ ██║"
echo " ╚═════╝╚══════╝╚═╝     ╚═╝╚═╝     ╚═╝"
echo -e "${NC}"
echo -e "${GREEN}Welcome to CLMM (Clean My Mac CLI) Installer!${NC}\n"

# 1. Check requirements
command -v git >/dev/null 2>&1 || { echo -e "${RED}Error: Git is required but not installed.${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}Error: Node.js is required but not installed.${NC}" >&2; exit 1; }

NODE_VERSION=$(node -v | cut -d "v" -f 2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d "." -f 1)
NODE_MINOR=$(echo $NODE_VERSION | cut -d "." -f 2)

if [ "$NODE_MAJOR" -lt 20 ] || ( [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 12 ] ); then
    echo -e "${RED}Error: Node.js v20.12.0 or higher is required. You are currently using v$NODE_VERSION.${NC}" >&2
    echo -e "${YELLOW}Please upgrade Node.js (e.g., using nvm: nvm install 20) and try again.${NC}" >&2
    exit 1
fi

command -v npm >/dev/null 2>&1 || { echo -e "${RED}Error: npm is required but not installed.${NC}" >&2; exit 1; }

INSTALL_DIR="$HOME/.clmm"
REPO_URL="https://github.com/0xAstroAlpha/clmm-clean-my-mac-cli.git"

# 2. Clone or update repository
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}Updating existing CLMM installation at $INSTALL_DIR...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main --quiet
else
    echo -e "${CYAN}Cloning CLMM to $INSTALL_DIR...${NC}"
    git clone --quiet "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# 3. Install packages & Build
echo -e "${CYAN}Installing dependencies & building source code...${NC}"
npm install --silent
npm run build --silent

# 4. Global Link
echo -e "${CYAN}Linking terminal command globally...${NC}"
sudo npm link >/dev/null 2>&1 || npm link >/dev/null 2>&1

echo -e "\n${GREEN}✨ CLMM Installed Successfully!${NC}"
echo -e "You can now strictly run ${YELLOW}clmm${NC} from anywhere in your terminal."
echo -e "Try running: ${CYAN}clmm check${NC} or ${CYAN}clmm --help${NC}\n"
