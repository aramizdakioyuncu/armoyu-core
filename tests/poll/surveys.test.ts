import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const POLL_ID = Number(process.env.ARMOYU_TEST_POLL_ID || '207');
const OPTION_ID = Number(process.env.ARMOYU_TEST_POLL_OPTION_ID || '410');

async function runPollSurveysTest() {
  console.log('--- Poll Service: Surveys (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getPolls ---
  console.log();
  logOldSection('[OLD API Test] getPolls');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.polls.getPolls(1);
    if (result.durum === 1) {
      logOldSuccess(`Polls fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(poll =>
        console.log(`\x1b[36m  #${poll.id} "${poll.question}" — votes: ${poll.totalVotes} | status: ${poll.status} | voted: ${poll.isVoted}\x1b[0m`)
      );
    } else {
      logOldError('getPolls returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getPolls failed', err);
  }

  // --- CURRENT (V2) getPolls ---
  console.log();
  logCurrentSection('[CURRENT API Test] getPolls');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.polls.getPolls(1);
    if (result.durum === 1) {
      logCurrentSuccess(`Polls fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(poll =>
        console.log(`\x1b[33m  #${poll.id} "${poll.question}" — votes: ${poll.totalVotes} | owner: ${poll.owner?.displayName} | options: ${poll.options?.length}\x1b[0m`)
      );
    } else {
      logCurrentError('getPolls returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getPolls failed', err);
  }

  // --- CURRENT (V2) getPoll (detail) ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getPoll (id: ${POLL_ID})`);
  try {
    const result = await apiCurrent.polls.getPoll(POLL_ID);
    if (result.durum === 1) {
      const poll = result.icerik!;
      logCurrentSuccess(`Poll detail: #${poll.id} "${poll.question}" — votes: ${poll.totalVotes} | options: ${poll.options?.length ?? 0}`);
      poll.options?.forEach(opt =>
        console.log(`\x1b[33m    - [${opt.id}] "${opt.answer}" — ${opt.votingPercentage}%\x1b[0m`)
      );
    } else {
      logCurrentError('getPoll returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getPoll failed', err);
  }

  // --- CURRENT (V2) vote ---
  console.log();
  logCurrentSection(`[CURRENT API Test] vote (poll: ${POLL_ID}, option: ${OPTION_ID})`);
  try {
    const result = await apiCurrent.polls.vote(POLL_ID, OPTION_ID);
    if (result.durum === 1) {
      const poll = result.icerik;
      if (poll && typeof poll === 'object' && 'id' in poll) {
        logCurrentSuccess(`Voted! Updated poll: #${poll.id} "${poll.question}" — total votes: ${poll.totalVotes} | didIVote: ${poll.isVoted} | selected: ${poll.selectedOptionId}`);
      } else {
        logCurrentSuccess(`Voted successfully`);
      }
    } else {
      logCurrentError('vote returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT vote failed', err);
  }
}

runPollSurveysTest();
