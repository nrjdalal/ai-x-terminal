#!/bin/zsh

export NODE_NO_WARNINGS=1

# Array of commands, currently with only one command
cmds=(
  "ax hi there"
  "ax -ls what do you think about my project structure, is it any good"
  "ax -w are there any improvements you would suggest"
)

# Function to echo text character by character
typing() {
  local text="$1"
  local length=${#text}

  # Print first two characters in bold green
  echo -n -e "\033[1;32m${text:0:2}\033[0m"
  sleep 0.1 # Adjust the sleep time to control typing speed

  # Print the remaining characters normally, without bold
  for ((i = 2; i < length; i++)); do
    char="${text:$i:1}"
    if [[ "$char" == "-" ]]; then
      # Handle dash explicitly, ensuring it's printed correctly
      echo -n -e "\x2d"
    else
      echo -n "$char"
    fi
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

clear

# Loop through each cmd and process based on mode
for cmd in "${cmds[@]}"; do
  # Show the prompt with > symbol and the correct colors
  echo -e -n "nrjdalal \033[0;36m~/Desktop/ai-x-terminal\033[0m \033[0;37mmain\033[0m\n\033[0;32m>\033[0m "
  sleep 2

  # Print the command with typing effect (including the dash correctly)
  typing "$cmd"
  sleep 1

  # If mode is "run", execute the cmd
  if [[ "$mode" == "run" ]]; then
    eval "$cmd" # Executes the cmd
    echo        # Add a new line after the command output
  fi

done

exit
