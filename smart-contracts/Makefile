# Load environment variables
-include .env

RPC_URL_MONAD := $(RPC_URL_MONAD_TESTNET)
RPC_URL_LOCAL := http://127.0.0.1:8545
ACCOUNT := acc3
ETHERSCAN_API_KEY := $(ETHERSCAN_API_KEY)

CONTRACT := $(CONTRACT_ADDRESS)
USER := $(USER_ADDRESS)

# ================================
# BUILD
# ================================

build:
	forge build

clean:
	forge clean

rebuild:
	forge clean && forge build

format:
	forge fmt

# ================================
# TESTING
# ================================

test:
	forge test -vv

test-verbose:
	forge test -vvvv

gas:
	forge test --gas-report

trace:
	forge test --debug

coverage:
	forge coverage

# ================================
# DEPLOYMENT
# ================================

# Dry run (no broadcast)
simulate:
	forge script script/LockFi.s.sol \
	--rpc-url $(RPC_URL_MONAD) \
	--account $(ACCOUNT) \
	-vvv

# Deploy to Monad testnet
deploy-monad:
	forge script script/LockFi.s.sol \
	--rpc-url $(RPC_URL_MONAD) \
	--account $(ACCOUNT) \
	--broadcast \
	--verify \
	--etherscan-api-key $(ETHERSCAN_API_KEY) \
	-vvv

# Deploy to local Anvil
deploy-local:
	forge script script/LockFi.s.sol \
	--rpc-url $(RPC_URL_LOCAL) \
	--account $(ACCOUNT) \
	--broadcast \
	-vvv

# ================================
# FORKING (VERY USEFUL)
# ================================

fork-anvil:
	anvil --fork-url $(RPC_URL_MONAD)

# ================================
# CONTRACT INTERACTIONS
# ================================

deposit:
	cast send $(CONTRACT) \
	"deposit()" \
	--value 1ether \
	--account $(ACCOUNT) \
	--rpc-url $(RPC_URL_MONAD)

withdraw:
	cast send $(CONTRACT) \
	"withdraw(uint256)" \
	100000000000000000 \
	--account $(ACCOUNT) \
	--rpc-url $(RPC_URL_MONAD)

withdraw-amount:
	cast send $(CONTRACT) \
	"withdraw(uint256)" \
	$(AMOUNT) \
	--account $(ACCOUNT) \
	--rpc-url $(RPC_URL_MONAD)

execute:
	cast send $(CONTRACT) \
	"executeWithdraw()" \
	--account $(ACCOUNT) \
	--rpc-url $(RPC_URL_MONAD)

cancel:
	cast send $(CONTRACT) \
	"cancelWithdraw()" \
	--account $(ACCOUNT) \
	--rpc-url $(RPC_URL_MONAD)

lock:
	cast send $(CONTRACT) \
	"emergencyLock()" \
	--account $(ACCOUNT) \
	--rpc-url $(RPC_URL_MONAD)

# ================================
# VIEW FUNCTIONS
# ================================

balance:
	cast call $(CONTRACT) \
	"getUserVaultBalance(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

pending:
	cast call $(CONTRACT) \
	"hasPendingWithdraw(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

limit:
	cast call $(CONTRACT) \
	"getInstantWithdrawLimit(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

pending-data:
	cast call $(CONTRACT) \
	"getPendingWithdraw(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

locked:
	cast call $(CONTRACT) \
	"isVaultLocked(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

lock-time:
	cast call $(CONTRACT) \
	"getRemainingLockTime(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

pending-time:
	cast call $(CONTRACT) \
	"getRemainingPendingTime(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

user-state:
	cast call $(CONTRACT) \
	"getUserState(address)" \
	$(USER) \
	--rpc-url $(RPC_URL_MONAD)

vault-balance:
	cast call $(CONTRACT) \
	"totalBalance()" \
	--rpc-url $(RPC_URL_MONAD)

address-acc3:
	0x0944f6502a7e99f073750000c4f7889611a706c6