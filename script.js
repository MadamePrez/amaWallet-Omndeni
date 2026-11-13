// GuardianChain / TapSafe Client Logic

let totalBalance = 4850.00;
let pendingCount = 1;
let angelBalance = 45.00;

function formatRand(amount) {
    return `R${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function switchTab(tabId) {
    document.querySelectorAll('.dashboard-view').forEach(el => el.classList.add('hidden'));
    document.getElementById('tab-' + tabId).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'text-pink-600', 'shadow-sm');
        btn.classList.add('text-slate-600');
    });

    const activeBtn = document.getElementById('btn-' + tabId);
    if(activeBtn) {
        activeBtn.classList.add('bg-white', 'text-pink-600', 'shadow-sm');
        activeBtn.classList.remove('text-slate-600');
    }
}

function showToast(msg, icon = '✨') {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    document.getElementById('toast-icon').innerText = icon;
    toast.classList.remove('translate-y-32', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-32', 'opacity-0');
    }, 4000);
}

function approveRequest(id, amount, name) {
    const reqCard = document.getElementById('req-' + id);
    if(reqCard) {
        reqCard.style.transition = 'all 0.3s ease';
        reqCard.style.opacity = '0';
        setTimeout(() => reqCard.remove(), 300);
    }
    pendingCount = Math.max(0, pendingCount - 1);
    document.getElementById('stat-pending-count').innerText = pendingCount;
    
    totalBalance -= amount;
    document.getElementById('stat-total-balance').innerText = formatRand(totalBalance);

    addLedgerLog('ESCROW_RELEASE', `${name} allowance release`, `-${formatRand(amount)}`, 'emerald');
    showToast(`Successfully released ${formatRand(amount)} to ${name} via XRPL Escrow!`, '🎉');
}

function rejectRequest(id, name) {
    const reqCard = document.getElementById('req-' + id);
    if(reqCard) {
        reqCard.style.opacity = '0';
        setTimeout(() => reqCard.remove(), 300);
    }
    pendingCount = Math.max(0, pendingCount - 1);
    document.getElementById('stat-pending-count').innerText = pendingCount;
    addLedgerLog('MANDATE_REJECT', `${name}'s request denied by Zithobile`, 'R0.00', 'amber');
    showToast(`Request from ${name} successfully denied.`, '🛡️');
}

function sendSimulatedRequest() {
    const input = document.getElementById('simulated-msg');
    const val = input.value.trim();
    if(!val) {
        showToast('Please type a simulated message!', '⚠️');
        return;
    }
    pendingCount++;
    document.getElementById('stat-pending-count').innerText = pendingCount;

    const container = document.getElementById('requests-container');
    const newId = Date.now();
    const html = `
        <div id="req-${newId}" class="p-5 rounded-2xl bg-gradient-to-r from-pink-50/50 to-purple-50/50 border border-pink-100/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-2xl bg-purple-200/80 flex items-center justify-center text-xl shadow-inner shrink-0">💬</div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h4 class="font-bold text-slate-800">Family WhatsApp Bot</h4>
                        <span class="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md">Incoming Request</span>
                    </div>
                    <p class="text-sm font-semibold text-slate-700 mt-1">"${val}"</p>
                    <div class="flex items-center space-x-3 mt-2 text-xs text-slate-500">
                        <span>⏱️ Just now</span>
                        <span>•</span>
                        <span class="text-emerald-600 font-medium">✓ XRPL Policy Check: Validated</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button onclick="approveRequest(${newId}, 20, 'Family Member')" class="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all">
                    Approve (1-Click)
                </button>
                <button onclick="rejectRequest(${newId}, 'Family Member')" class="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all">
                    Deny
                </button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', html);
    input.value = '';
    showToast('New family message received via WhatsApp bot relay!', '🔔');
}

function addLedgerLog(type, desc, amount, color) {
    const logs = document.getElementById('ledger-logs');
    const dotColor = color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500';
    const textColor = color === 'emerald' ? 'text-emerald-600' : 'text-amber-600';
    const html = `
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <span class="w-2 h-2 rounded-full ${dotColor}"></span>
                <div>
                    <span class="font-bold text-slate-700">${type}</span>
                    <p class="text-slate-400 text-[10px]">${desc} | Hash: ${Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                </div>
            </div>
            <span class="${textColor} font-bold">${amount}</span>
        </div>
    `;
    logs.insertAdjacentHTML('afterbegin', html);
}

function triggerNewDepositModal() {
    totalBalance += 500.00;
    document.getElementById('stat-total-balance').innerText = formatRand(totalBalance);
    addLedgerLog('VAULT_DEPOSIT', 'Added funds to family vault', `+${formatRand(500)}`, 'emerald');
    showToast(`Successfully added ${formatRand(500)} to family vault!`, '💰');
}

function triggerEmergencyLock() {
    addLedgerLog('EMERGENCY_LOCK', 'All agent spending channels frozen by Zithobile', 'R0.00', 'amber');
    showToast('🚨 Emergency Freeze Activated! All AI agent spending halted instantly.', '🚨');
}

function triggerAddFamilyModal() {
    showToast('Opening New Guardian Mandate panel...', '🛡️');
}

function triggerTapToPayModal() {
    document.getElementById('modal-tap').classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById('modal-tap').classList.add('hidden');
}

function confirmTapToPay() {
    closeModal('modal-tap');
    angelBalance = Math.max(0, angelBalance - 8.50);
    document.getElementById('angel-pocket-balance').innerText = formatRand(angelBalance);
    addLedgerLog('TAP_TO_PAY', 'Angel canteen biometric checkout', `-${formatRand(8.5)}`, 'emerald');
    showToast(`✨ Tap-to-pay successful! ${formatRand(8.5)} paid in 3s.`, '📱');
}

function triggerAskMomModal() {
    showToast('💬 WhatsApp bot ping sent to Zithobile!', '✨');
}

function triggerGrannySOS() {
    showToast('🚨 Priority emergency alert sent to Zithobile & WhatsApp Bot!', '👵');
}
