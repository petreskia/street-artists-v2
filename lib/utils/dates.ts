export const auctionTime = 120 // 2 minutes in seconds

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export function generateDateLabels(daysAgo: number): string[] {
  const labels = []
  for (let i = daysAgo - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    labels.push(formatDate(date.toISOString()))
  }
  return labels
}

export function startTimer(initialTime: number, onTick?: (time: number) => void, onEnd?: () => void): void {
  let timeRemaining = initialTime

  const timer = setInterval(() => {
    timeRemaining--
    onTick?.(timeRemaining)

    if (timeRemaining <= 0) {
      clearInterval(timer)
      onEnd?.()
    }
  }, 1000)
}

let auctionStatus = true

function setAuctionStatus(status: boolean): void {
  auctionStatus = status
}

export function endAuction(): void {
  setAuctionStatus(false)
  if (typeof window !== "undefined") {
    localStorage.removeItem("auctionTimer")
  }
}
