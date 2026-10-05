import json
import heapq

with open('building.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def solve(start_id, blocked_nodes=None, blocked_edges=None, closed_exits=None):
    blocked_nodes = set(blocked_nodes or [])
    blocked_edges = set(blocked_edges or [])
    closed_exits = set(closed_exits or [])

    if start_id in blocked_nodes:
        return 'Starting location blocked'

    adj = {n['id']: [] for n in data['nodes']}
    for e in data['edges']:
        if e['id'] in blocked_edges:
            continue
        if e['from'] in blocked_nodes or e['to'] in blocked_nodes:
            continue
        adj[e['from']].append((e['to'], e['cost']))
        adj[e['to']].append((e['from'], e['cost']))

    dist = {n['id']: float('inf') for n in data['nodes']}
    best_path = {n['id']: None for n in data['nodes']}
    dist[start_id] = 0
    best_path[start_id] = [start_id]

    pq = [(0, [start_id], start_id)]
    node_types = {n['id']: n['type'] for n in data['nodes']}

    while pq:
        c, path, u = heapq.heappop(pq)
        if c > dist[u]:
            continue
        if node_types[u] == 'exit':
            continue
        for v, edge_cost in adj[u]:
            if node_types[v] == 'exit' and v in closed_exits:
                continue
            new_cost = c + edge_cost
            new_path = path + [v]
            if new_cost < dist[v] or (new_cost == dist[v] and new_path < (best_path[v] or [])):
                dist[v] = new_cost
                best_path[v] = new_path
                heapq.heappush(pq, (new_cost, new_path, v))

    open_exits = [n['id'] for n in data['nodes'] if n['type'] == 'exit' and n['id'] not in closed_exits]
    candidates = []
    for ex in open_exits:
        if dist[ex] < float('inf'):
            candidates.append((dist[ex], ex, best_path[ex]))

    if not candidates:
        return 'No route available'

    candidates.sort()
    best = candidates[0]
    path_str = ' - '.join(best[2])
    return f"{path_str}; cost {best[0]}"

print("Test 1 (Baseline R1):", solve("R1"))
print("Test 2 (Block C2):", solve("R1", blocked_nodes=["C2"]))
print("Test 3 (Close E1, E2):", solve("R1", closed_exits=["E1", "E2"]))
print("Test 4 (Start R2):", solve("R2"))
print("Test 5 (Block R1):", solve("R1", blocked_nodes=["R1"]))
