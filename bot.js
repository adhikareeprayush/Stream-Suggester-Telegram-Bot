const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your bot's token and TMDb API key
const token = '7261450136:AAFP8_Agfd9CYo5QdjaCmGXCklN_xo7jd5g';
const tmdbApiKey = '7c54c7692dc83c31218a8b26dc7998a0';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Store user sessions in memory (for simplicity)
let userSessions = {};

// Define genres
const genres = {
    action: 28,
    adventure: 12,
    comedy: 35,
    drama: 18,
    horror: 27,
    science_fiction: 878,
    romance: 10749,
    thriller: 53,
    animation: 16,
    family: 10751,
    fantasy: 14,
    mystery: 9648
};

// Define languages
const languages = {
    english: 'en',
    hindi: 'hi',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    japanese: 'ja',
    korean: 'ko',
    chinese: 'zh'
};

// Listen for '/start' command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to MovieSuggester! 🎬 Use the button below to get started.", {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Get Movie Recommendations', callback_data: 'recommend' }]
            ]
        }
    });
});

// Handle callback queries from inline buttons
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const userSession = userSessions[chatId];

    if (data === 'recommend') {
        startRecommendationProcess(chatId);
    } else if (Object.keys(genres).includes(data)) {
        handleGenreSelection(chatId, data);
    } else if (Object.keys(languages).includes(data)) {
        handleLanguageSelection(chatId, data);
    } else if (data === 'generate_more') {
        handleGenerateMore(chatId, userSession);
    } else if (data === 'back_to_menu') {
        startRecommendationProcess(chatId);
    }

    // Answer the callback query to remove the loading state
    bot.answerCallbackQuery(callbackQuery.id);
});

function startRecommendationProcess(chatId) {
    userSessions[chatId] = { recommendations: [] }; // Initialize a new session
    bot.sendMessage(chatId, "Please choose a genre:", {
        reply_markup: {
            inline_keyboard: createButtonGrid(Object.keys(genres), 3)
        }
    });
}

function handleGenreSelection(chatId, genre) {
    userSessions[chatId].genre = genre;
    bot.sendMessage(chatId, "Great! Now, please choose a language:", {
        reply_markup: {
            inline_keyboard: createButtonGrid(Object.keys(languages), 3)
        }
    });
}

async function handleLanguageSelection(chatId, language) {
    const userSession = userSessions[chatId];
    userSession.language = language;
    bot.sendMessage(chatId, "Fetching movie recommendations for you...");

    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: tmdbApiKey,
                language: 'en-US',
                sort_by: 'popularity.desc',
                with_genres: genres[userSession.genre],
                with_original_language: languages[language]
            }
        });

        const movies = response.data.results;
        userSession.recommendations = movies;

        if (movies.length > 0) {
            await sendRecommendations(chatId, movies.slice(0, 5));
            userSession.recommendations = movies.slice(5);

            if (userSession.recommendations.length > 0) {
                bot.sendMessage(chatId, "Would you like to see more recommendations?", {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Show More', callback_data: 'generate_more' }],
                            [{ text: 'Start Over', callback_data: 'recommend' }]
                        ]
                    }
                });
            } else {
                bot.sendMessage(chatId, "That's all the recommendations I have for now. Would you like to start over?", {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Start Over', callback_data: 'recommend' }]
                        ]
                    }
                });
            }
        } else {
            bot.sendMessage(chatId, `Sorry, I couldn't find any ${userSession.genre} movies in ${language}. Would you like to try again?`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Try Again', callback_data: 'recommend' }]
                    ]
                }
            });
        }
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, something went wrong while fetching recommendations. Please try again.", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Try Again', callback_data: 'recommend' }]
                ]
            }
        });
    }
}
async function handleGenerateMore(chatId, userSession) {
    if (!userSession) {
        bot.sendMessage(chatId, "It seems that your session has expired. Please start over to get new recommendations.", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Start Over', callback_data: 'recommend' }]
                ]
            }
        });
        return;
    }

    if (userSession.recommendations.length > 0) {
        const moviesToShow = userSession.recommendations.slice(0, 5);
        await sendRecommendations(chatId, moviesToShow);
        userSession.recommendations = userSession.recommendations.slice(5);

        if (userSession.recommendations.length > 0) {
            bot.sendMessage(chatId, "Would you like to see more recommendations?", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Show More', callback_data: 'generate_more' }],
                        [{ text: 'Start Over', callback_data: 'recommend' }]
                    ]
                }
            });
        } else {
            bot.sendMessage(chatId, "That's all the recommendations I have for now. Would you like to start over?", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Start Over', callback_data: 'recommend' }]
                    ]
                }
            });
        }
    } else {
        bot.sendMessage(chatId, "No more recommendations available. Would you like to start over?", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Start Over', callback_data: 'recommend' }]
                ]
            }
        });
    }
}


// Function to send recommendations
const sendRecommendations = async (chatId, movies) => {
    for (const movie of movies) {
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
        const movieDetails = `
*${movie.title}* (${movie.release_date.split('-')[0]})
*Rating:* ${movie.vote_average}/10
*Overview:* ${movie.overview || 'No overview available.'}
        `;

        if (posterUrl) {
            await bot.sendPhoto(chatId, posterUrl, { caption: movieDetails, parse_mode: 'Markdown' });
        } else {
            await bot.sendMessage(chatId, movieDetails, { parse_mode: 'Markdown' });
        }
    }
};

// Helper function to create a grid of buttons
function createButtonGrid(items, columnsPerRow) {
    return items.reduce((acc, item, index) => {
        const row = Math.floor(index / columnsPerRow);
        if (!acc[row]) {
            acc[row] = [];
        }
        acc[row].push({ text: item.charAt(0).toUpperCase() + item.slice(1), callback_data: item });
        return acc;
    }, []);
}