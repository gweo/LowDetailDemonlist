import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import Spinner from '../components/Spinner.js';

const playerCountries = {
    "Freenora": "ie",
    "Adur": "pl",
    "Lukas": "it",
    "Thomas": "pt",
    "arda!!": "at",
    "S.O.S": "us",
    "7xv": "gb",
    "KayogreGD": "ro",
    "Dawgie": "nl",
    "Sinan": "az",
    "Kinder": "gb",
    "gweogd": "us",
    "Earl": "cz",
    "fev": "ru",
    "Vloxy": "pl",
    "Artemis 13": "gr",
    "Bill13high": "gr",
    "Lemon": "vn",
    "HJH4903": "ie",
    "AGDP": "ee",
    "Ferret90": "us"
};

const countryNames = {
    "at": "Austria",
    "az": "Azerbaijan",
    "ca": "Canada",
    "cz": "Czechia",
    "de": "Germany",
    "ee": "Estonia",
    "gb": "United Kingdom",
    "gr": "Greece",
    "ie": "Ireland",
    "it": "Italy",
    "jp": "Japan",
    "kr": "Korea",
    "nl": "Netherlands",
    "pl": "Poland",
    "pt": "Portugal",
    "ro": "Romania",
    "ru": "Russia",
    "tr": "Turkey",
    "us": "United States",
    "vn": "Vietnam"
};

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            leaderboard: [],
            loading: true,
            selected: 0,
            err: [],
            selectedCountry: 'all'
        };
    },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                
                <div class="board-container">
                    <div style="margin-bottom: 15px;">
                        <select v-model="selectedCountry" @change="selected = 0" style="width: 100%; padding: 10px; background: #222; color: #fff; border: 1px solid #444; border-radius: 5px; font-family: inherit;">
                            <option value="all">All nations</option>
                            <option v-for="(name, code) in countryNames" :value="code">
                                {{ getFlagEmojiByCode(code) }} {{ name }}
                            </option>
                        </select>
                    </div>

                    <table class="board">
                        <tr v-for="(entry, index) in filteredLeaderboard" :key="entry.user">
                            <td class="rank">
                                <p class="type-label-lg">#{{ entry.originalRank }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(entry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': leaderboard[selected]?.user === entry.user }">
                                <button @click="selectPlayer(entry.user)">
                                    <span class="type-label-lg">
                                        <span v-if="getFlagEmoji(entry.user)" style="margin-right: 8px;">{{ getFlagEmoji(entry.user) }}</span>
                                        {{ entry.user }}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player" v-if="entry">
                        <h1>
                            #{{ entry.originalRank }} 
                            <span v-if="getFlagEmoji(entry.user)" style="margin-right: 12px; font-size: 0.9em; vertical-align: middle;">{{ getFlagEmoji(entry.user) }}</span>
                            {{ entry.user }}
                        </h1>
                        <h3>{{ localize(entry.total) }}</h3>
                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length }})</h2>
                        <table class="table" v-if="entry.verified.length > 0">
                            <tr v-for="score in entry.verified">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table" v-if="entry.completed.length > 0">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{ entry.progressed.length }})</h2>
                        <table class="table" v-if="entry.progressed.length > 0">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
        countryNames() {
            return countryNames;
        },
        filteredLeaderboard() {
            const mapped = this.leaderboard.map((item, i) => ({
                ...item,
                originalRank: i + 1
            }));
            
            if (this.selectedCountry === 'all') {
                return mapped;
            }
            
            return mapped.filter(item => {
                const code = playerCountries[item.user];
                return code && code.toLowerCase() === this.selectedCountry.toLowerCase();
            });
        }
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    methods: {
        localize,
        getFlagEmoji(username) {
            const code = playerCountries[username];
            return this.generateEmoji(code);
        },
        getFlagEmojiByCode(code) {
            return this.generateEmoji(code);
        },
        generateEmoji(code) {
            if (!code) return '';
            const codePoints = code
                .toUpperCase()
                .split('')
                .map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        },
        selectPlayer(username) {
            const index = this.leaderboard.findIndex(p => p.user === username);
            if (index !== -1) {
                this.selected = index;
            }
        }
    },
};
