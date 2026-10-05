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
};
export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
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
                    <table class="board">
                        <tr v-for="(entry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(entry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected === i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">
                                        <!-- VLAJKA V TABULCE VLEVO -->
                                        <span v-if="playerCountries[entry.user]" :class="'fi fi-' + playerCountries[entry.user].toLowerCase()" style="margin-right: 8px; border-radius: 2px;"></span>
                                        {{ entry.user }}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player" v-if="entry">
                        <!-- VLAJKA U VELKÉHO JMÉNA PROFILU VPRAVO -->
                        <h1>
                            #{{ selected + 1 }} 
                            <span v-if="playerCountries[entry.user]" :class="'fi fi-' + playerCountries[entry.user].toLowerCase()" style="margin-right: 12px; border-radius: 3px; font-size: 0.8em; vertical-align: middle;"></span>
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
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    methods: {
        localize,
    },
};
