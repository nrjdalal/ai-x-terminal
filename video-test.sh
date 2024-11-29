#!/bin/zsh

# Function to echo text character by character
typing() {
  local text="$1"
  local length=${#text}
  for ((i = 0; i < length; i++)); do
    echo -n "${text:$i:1}"
    sleep 0.1 # Adjust the sleep time to control typing speed
  done
  echo
}

# Default mode (demo, no commands executed)
mode="demo"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
  --demo)
    mode="demo" # Just show commands, don't execute
    shift
    ;;
  --run)
    mode="run" # Show and execute commands
    shift
    ;;
  *)
    echo "Usage: $0 [--demo | --run]"
    exit 1
    ;;
  esac
done

# Array of cmds (replace with actual commands if needed)
cmds=(
  "ax how to create a next app, keep the answer short"
  "ax -ls what do you think about my project structure, is it any good"
  "ax -w what do you know about my project, keep the answer short yet explain about all files"
)

# Loop through each cmd and process based on mode
for cmd in "${cmds[@]}"; do
  # Show the prompt with > symbol
  echo -e -n "\nnrjdalal \033[0;36m~/Desktop/ai-x-terminal\033[0m \033[0;37mmain\033[0m\n\033[0;32m>\033[0m "
  sleep 3

  # Typing out the cmd (ensure dash is not stripped)
  typing "$cmd"
  sleep 3

  # If mode is "run", execute the cmd
  if [[ "$mode" == "run" ]]; then
    eval "$cmd" # Executes the cmd
  fi

  echo # Empty line after each cmd
done

exit
