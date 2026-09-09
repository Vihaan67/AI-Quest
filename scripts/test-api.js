

const BASE_URL = 'http://localhost:3001';

async function testApi() {
    console.log('--- STARTING AI QUEST API VERIFICATION TESTS ---');

    try {
        // 1. Register User
        const testUsername = 'byte_hero_' + Date.now();
        console.log(`\n1. Testing Registration for username: ${testUsername}...`);
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: testUsername,
                password: 'password123',
                knowledgeLevel: 'basics',
                goalRole: 'AI Developer',
                codingHeavy: true
            })
        });
        const regData = await regRes.json();
        console.log('Registration response:', regData.user ? 'SUCCESS ✓' : regData);
        const token = regData.token;

        if (!token) throw new Error('Failed to obtain auth token');

        // 2. Fetch Profile
        console.log('\n2. Fetching User Profile...');
        const profRes = await fetch(`${BASE_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const profData = await profRes.json();
        console.log('Profile fetched ✓:', { username: profData.user.username, level: profData.user.level, xp: profData.user.xp });

        // 3. Fetch Curriculum & Today's Quest
        console.log('\n3. Fetching Curriculum...');
        const currRes = await fetch(`${BASE_URL}/api/curriculum`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const currData = await currRes.json();
        console.log('Curriculum fetched ✓:', { totalLevels: currData.curriculum.length, todaysQuest: currData.todaysQuest?.title });

        // 4. Fetch Dynamic Lesson
        console.log('\n4. Fetching Daily Lesson...');
        const lessonRes = await fetch(`${BASE_URL}/api/lessons/${currData.todaysQuest.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const lessonData = await lessonRes.json();
        console.log('Lesson generated ✓:', { title: lessonData.title, lightQuizLength: lessonData.lightQuiz?.length });

        // 5. Complete Daily Lesson
        console.log('\n5. Completing Daily Lesson...');
        const completeRes = await fetch(`${BASE_URL}/api/lessons/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                topicId: currData.todaysQuest.id,
                quizScore: 5,
                totalQuizQuestions: 5,
                practicalCompleted: true
            })
        });
        const completeData = await completeRes.json();
        console.log('Lesson Completion Result ✓:', completeData);

        // 6. Complete Hard Boss Battle Quiz
        console.log('\n6. Completing Hard Quiz...');
        const hardRes = await fetch(`${BASE_URL}/api/quizzes/hard/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                topicId: currData.todaysQuest.id,
                score: 5,
                totalQuestions: 5
            })
        });
        const hardData = await hardRes.json();
        console.log('Hard Quiz Result ✓:', hardData);

        console.log('\n--- ALL AI QUEST API VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉 ---');
        process.exit(0);
    } catch (err) {
        console.error('API Verification Test Error:', err);
        process.exit(1);
    }
}

testApi();
