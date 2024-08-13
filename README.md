# Stream Suggester Bot

Welcome to **Stream Suggester Bot**, a Telegram bot that provides personalized movie recommendations based on your preferred genre and language. Powered by [The Movie Database (TMDb)](https://www.themoviedb.org/) API, this bot fetches the most popular movies tailored to your choices.

## Features

- **Genre Selection**: Choose from a variety of genres including Action, Comedy, Drama, Horror, and more.
- **Language Preference**: Get movie recommendations in your preferred language such as English, Hindi, Spanish, etc.
- **Interactive Interface**: Utilizes Telegram's inline buttons for a seamless user experience.
- **Dynamic Recommendations**: Fetches the latest popular movies from TMDb.
- **Session Management**: Remembers user sessions to provide continuous recommendations.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
- **Telegram Bot Token**: Obtain a bot token by creating a new bot via the [BotFather](https://telegram.me/BotFather) on Telegram.
- **TMDb API Key**: Sign up and get your API key from [TMDb](https://www.themoviedb.org/documentation/api).

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/adhikareeprayush/Stream-Suggester-Telegram-Bot.git
   cd StreamSuggesterBot
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add your credentials:

   ```env
   YOUR_BOTS_TOKEN=your_telegram_bot_token_here
   YOUR_TMDb_API_TOKEN=your_tmdb_api_key_here
   ```

4. **Run the Bot**

   ```bash
   node index.js
   ```

## Usage

1. **Start the Bot**: Open Telegram and search for your bot. Click **Start** or send `/start`.

2. **Get Recommendations**: Click on "Get Movie Recommendations" to begin.

3. **Choose Genre**: Select your preferred genre from the list.

4. **Choose Language**: Select your preferred language.

5. **View Recommendations**: The bot will fetch and display a list of movie recommendations based on your selections.

6. **More Recommendations**: If available, you can choose to see more recommendations or start over.

## Supported Genres

- Action
- Adventure
- Comedy
- Drama
- Horror
- Science Fiction
- Romance
- Thriller
- Animation
- Family
- Fantasy
- Mystery

## Supported Languages

- English
- Hindi
- Spanish
- French
- German
- Japanese
- Korean
- Chinese

## Project Structure

- `index.js`: Main bot logic.
- `package.json`: Project metadata and dependencies.
- `.env`: Environment variables (not included in the repository).

## Dependencies

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api): Telegram Bot API for Node.js.
- [axios](https://github.com/axios/axios): Promise-based HTTP client for the browser and Node.js.
- [dotenv](https://github.com/motdotla/dotenv): Loads environment variables from `.env` file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for the movie data.
- [Telegram](https://telegram.org/) for the platform and API.

---

_Happy Movie Watching! 🎬_
