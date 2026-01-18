interface OrderAuditLog {
  $id: string;
  previousStatus?: string;
  newStatus?: string;
  performedByRole: string;
  $createdAt: string;
}


export function OrderTimeline({ logs }: { logs: OrderAuditLog[] }) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.$id} className="border-l-2 pl-4">
          <p className="text-sm font-medium">
            {log.previousStatus} → {log.newStatus}
          </p>
          <p className="text-xs text-gray-500">
            {log.performedByRole} •{" "}
            {new Date(log.$createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
