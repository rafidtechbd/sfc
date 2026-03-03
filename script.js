function calculateFees() {
    const sessionBase = 10150; 
    const monthlyRate = 275;
    const examRate = 575;
    const yearChangeRate = 1250;
    const picnicRate = 500;
    const formFillupScience = 3435;
    const formFillupArts = 3155;

    const dept = document.getElementById('department').value;
    const paidMonthsInput = document.getElementById('paidMonths');
    const paidMonths = parseInt(paidMonthsInput.value) || 0;
    const paidExams = parseInt(document.getElementById('paidExams').value);
    const isYearChangePaid = document.getElementById('yearChangePaid').checked;
    const wentPicnic = document.getElementById('wentPicnic').checked;
    const isFormFillupPaid = document.getElementById('formFillupPaid').checked;

    if (paidMonths > 24) {
        alert("সেশন সর্বোচ্চ 24 মাসের হতে পারে।");
        paidMonthsInput.value = 24;
        return;
    }

    const currentFormFillupRate = (dept === 'science') ? formFillupScience : formFillupArts;
    
    // Grand Total: Includes Picnic ONLY if check is ON
    let grandTotal = sessionBase + currentFormFillupRate;
    if (!wentPicnic) {
        // If not going to picnic, the 500 is not expected, so total cost is less
        grandTotal -= picnicRate; 
    }

    // User's total paid
    let totalPaid = (paidMonths * monthlyRate) + (paidExams * examRate);
    if (isYearChangePaid) totalPaid += yearChangeRate;
    if (isFormFillupPaid) totalPaid += currentFormFillupRate;
    
    let totalDue = grandTotal - totalPaid;
    if (totalDue < 0) totalDue = 0;

    const resultArea = document.getElementById('resultArea');
    const congratsBox = document.getElementById('congratsBox');
    const statusMessage = document.getElementById('statusMessage');

    resultArea.classList.remove('hidden');
    // .toLocaleString('en-US') use kora hoyeche jeno browser ar vasa ja-i hok, songkha english ei ashe
    document.getElementById('formFillupDisplay').innerText = currentFormFillupRate.toLocaleString('en-US') + " ৳";
    document.getElementById('grandTotalLabel').innerText = grandTotal.toLocaleString('en-US') + " ৳";
    document.getElementById('totalPaid').innerText = totalPaid.toLocaleString('en-US') + " ৳";
    document.getElementById('totalDue').innerText = totalDue.toLocaleString('en-US') + " ৳";

    // Picnic Status UI Update
    const picnicLabel = document.getElementById('picnicStatusLabel');
    const picnicAmount = document.getElementById('picnicDisplayAmount');
    
    if (wentPicnic) {
        picnicLabel.innerHTML = "পিকনিক এ গিয়েছেন:";
        picnicAmount.innerText = "500 ৳";
        picnicAmount.classList.remove('text-gray-400');
    } else {
        picnicLabel.innerHTML = "পিকনিক এ যাননি:";
        picnicAmount.innerText = "0 ৳";
        picnicAmount.classList.add('text-gray-400');
    }

    let monthsLeft = 24 - paidMonths;
    let examsLeft = 4 - paidExams;
    
    let details = `<div class="font-bold mb-2 text-gray-800">বাকি আছে (বকেয়া তালিকা):</div><ul class="space-y-1 text-left inline-block">`;
    let hasDue = false;

    if (monthsLeft > 0) {
        details += `<li class="text-red-600 font-semibold">• ${monthsLeft} মাসের বেতন</li>`;
        hasDue = true;
    }
    if (examsLeft > 0) {
        details += `<li class="text-red-600 font-semibold">• ${examsLeft}টি পরীক্ষার ফি</li>`;
        hasDue = true;
    }
    if (!isYearChangePaid) {
        details += `<li class="text-red-600 font-semibold">• ইয়ার চেঞ্জ ফি (1250/-)</li>`;
        hasDue = true;
    }
    if (!isFormFillupPaid) {
        details += `<li class="text-red-600 font-semibold">• ফর্ম ফিলাপের ফি (${currentFormFillupRate.toLocaleString('en-US')}/-)</li>`;
        hasDue = true;
    }
    details += `</ul>`;

    if (totalDue <= 0 && !hasDue) {
        congratsBox.classList.remove('hidden');
        statusMessage.innerHTML = "<span class='text-green-600 font-bold'>আপনার এই সেশনের সকল পাওনা পরিশোধিত।</span>";
    } else {
        congratsBox.classList.add('hidden');
        statusMessage.innerHTML = details;
    }

    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}