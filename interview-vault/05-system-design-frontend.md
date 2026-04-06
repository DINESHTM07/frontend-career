# Frontend System Design — 10 Questions with Detailed Answers

> **How to use this guide:**
> - Frontend system design interviews test architectural thinking, not algorithmic problem-solving
> - Always start with **requirements gathering** — never jump to a solution
> - Structure every answer: Requirements → Architecture → State → API → Performance → Scale
> - Draw diagrams when possible — even ASCII art communicates spatial thinking
> - `🟡 MEDIUM` `🔴 HARD` — complexity of the design question

---

## Table of Contents

1. [Design a Chat Application Frontend](#1-design-a-chat-application-frontend)
2. [Design an Infinite Scroll Feed](#2-design-an-infinite-scroll-feed)
3. [Design a Form Builder](#3-design-a-form-builder)
4. [Design an E-Commerce Cart](#4-design-an-e-commerce-cart)
5. [Design a Real-Time Notification System](#5-design-a-real-time-notification-system)
6. [Design a File Upload Component with Progress](#6-design-a-file-upload-component-with-progress)
7. [Design a Search Autocomplete](#7-design-a-search-autocomplete)
8. [Design a Dashboard with Widgets](#8-design-a-dashboard-with-widgets)
9. [State Management Architecture for a Large App](#9-state-management-architecture-for-a-large-app)
10. [Caching Strategies for Frontend Apps](#10-caching-strategies-for-frontend-apps)

---

## Framework: How to Answer Any Frontend Design Question

```
1. REQUIREMENTS (2–3 min)
   ├── Functional: what must it do?
   ├── Non-functional: scale, latency, offline, accessibility
   └── Out of scope: what are we explicitly NOT building?

2. COMPONENT ARCHITECTURE (3–4 min)
   ├── Component tree — what renders what
   ├── Separation of concerns — container vs presentational
   └── Shared vs isolated components

3. STATE MANAGEMENT (3–4 min)
   ├── Server state — remote data, cache, sync
   ├── Client state — UI, user interaction
   └── Where does each piece of state live?

4. API DESIGN (2–3 min)
   ├── What endpoints do you need?
   ├── Request/response shape
   └── Real-time: WebSocket vs SSE vs polling?

5. PERFORMANCE (2–3 min)
   ├── Rendering strategy (CSR, SSR, SSG)
   ├── Code splitting, lazy loading
   └── Perceived performance tricks

6. SCALABILITY & EDGE CASES (2 min)
   ├── What breaks at 10x scale?
   ├── Error states, offline, auth expiry
   └── Accessibility requirements
```

---

## 1. Design a Chat Application Frontend

**🔴 HARD**

---

### Requirements Gathering

**Functional requirements:**
- Real-time messaging between users (1:1 and group chats)
- Message delivery status: sent → delivered → read
- Online presence indicators (online/offline/typing)
- Message history (infinite scroll up to load older messages)
- File and image sharing
- Emoji reactions

**Non-functional requirements:**
- Messages appear < 100ms after server confirmation
- App works with flaky connections (offline queuing)
- Support 10,000 concurrent users per room
- Accessibility: screen reader support for incoming messages

**Out of scope:** Video calls, end-to-end encryption (mention you'd add later), admin moderation tools.

---

### Component Architecture

```
<ChatApp>
├── <Sidebar>
│   ├── <UserProfile />
│   ├── <ConversationSearch />
│   └── <ConversationList>
│       └── <ConversationItem />  (avatar, name, last message, unread count)
│
└── <ChatPanel>
    ├── <ChatHeader>
    │   ├── <ParticipantInfo />
    │   └── <OnlineStatus />
    │
    ├── <MessageList>              ← virtualized (react-virtual)
    │   ├── <DateSeparator />
    │   ├── <Message>
    │   │   ├── <MessageBubble />
    │   │   ├── <MessageStatus />  (sent/delivered/read checkmarks)
    │   │   └── <ReactionBar />
    │   └── <TypingIndicator />
    │
    └── <MessageInput>
        ├── <TextArea />           (auto-resize)
        ├── <EmojiPicker />
        └── <FileAttachment />
```

---

### State Management Approach

```
SERVER STATE (TanStack Query / SWR)
├── Conversation list          → useQuery(['conversations'])
├── Message history            → useInfiniteQuery(['messages', conversationId])
└── User presence              → managed via WebSocket (not query cache)

CLIENT STATE (Zustand)
├── activeConversationId       string | null
├── optimisticMessages         Map<tempId, Message>   ← queued before server confirms
├── typingUsers                Map<conversationId, UserId[]>
├── onlineUsers                Set<UserId>
└── draftMessages              Map<conversationId, string>   ← persist to localStorage

WEBSOCKET STATE (custom store, updated by WS events)
├── connection status          'connecting' | 'open' | 'closed' | 'error'
└── event handlers             message | presence | typing | delivery_receipt
```

**Optimistic updates — message sending flow:**

```
User hits send
  → Generate tempId (uuid)
  → Add to optimisticMessages with status: 'sending'
  → Display immediately in MessageList
  → POST to /api/messages
  → On success: replace tempId with real message from server, status: 'sent'
  → On failure: mark message as 'failed', show retry button
  → WebSocket event 'delivered': update message status
  → WebSocket event 'read': update to read receipt
```

---

### API Design

**REST endpoints:**
```
GET    /api/conversations                     — list user's conversations
GET    /api/conversations/:id/messages        — paginated history
       ?before=<messageId>&limit=50           — cursor-based pagination
POST   /api/messages                          — send message
       { conversationId, content, type, tempId }
POST   /api/messages/:id/reactions            — add emoji reaction
POST   /api/upload                            — get presigned S3 URL for file

WebSocket events (client → server):
  join_room   { conversationId }
  typing      { conversationId, isTyping }

WebSocket events (server → client):
  new_message      { message }
  delivery_receipt { messageId, status }
  presence_update  { userId, status }
  typing_update    { conversationId, userId, isTyping }
```

**Cursor-based pagination (not offset):**
```
Why cursor over offset?
- Offset: "give me messages 50–100"
  → if new message inserted, you get duplicates
- Cursor: "give me messages before message ID 12345"
  → stable regardless of insertions above the cursor
```

---

### Performance Considerations

**Message list virtualization:**
```jsx
// 10,000 messages in DOM = crash. Virtualize.
import { useVirtualizer } from '@tanstack/react-virtual';

// Variable height (messages have different lengths)
const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => containerRef.current,
  estimateSize: () => 60,        // estimate only — dynamic sizing
  overscan: 10,                  // render 10 items above/below visible area
});

// Scroll to bottom on new message
useEffect(() => {
  if (isAtBottom) {
    virtualizer.scrollToIndex(messages.length - 1, { behavior: 'smooth' });
  }
}, [messages.length]);
```

**Offline message queuing:**
```js
// IndexedDB queue — persists across refreshes
async function queueMessage(message) {
  await idb.put('outbox', { ...message, queuedAt: Date.now() });
}

// On reconnect — flush the queue
wsConnection.on('open', async () => {
  const pending = await idb.getAll('outbox');
  for (const msg of pending) {
    await sendMessage(msg);
    await idb.delete('outbox', msg.tempId);
  }
});
```

**Connection management:**
```js
// Exponential backoff reconnection
let retryDelay = 1000; // start at 1s
function reconnect() {
  setTimeout(() => {
    connect();
    retryDelay = Math.min(retryDelay * 2, 30000); // max 30s
  }, retryDelay);
}
```

---

### Scalability & Edge Cases

- **Message ordering:** Server timestamps can collide. Use logical clocks (Lamport timestamps) or server-assigned sequence numbers per conversation.
- **Notification when not in room:** Push notifications via Service Worker + Web Push API.
- **Read receipts at scale:** Batch receipt events — don't emit per-message, emit per-second with all read message IDs.
- **Large files:** Never upload through your API server. Get a presigned S3 URL, upload direct from client to S3, then notify server of completion.
- **Connection drops:** Store last-seen message ID; on reconnect, fetch messages since that ID to catch up.

---

## 2. Design an Infinite Scroll Feed

**🟡 MEDIUM**

---

### Requirements Gathering

**Functional:**
- Display paginated list of posts (text, image, video)
- Load new items as user scrolls near bottom
- Pull-to-refresh for new items at top
- Each post: like, comment count, share button
- Clicking post opens detail view

**Non-functional:**
- First paint < 1.5s (SSR or SSG first page)
- Smooth scroll — no jank on load
- Works at 100k posts

---

### Component Architecture

```
<FeedPage>
├── <FeedHeader>
│   └── <RefreshButton />  (or swipe gesture)
│
├── <PostList>             ← virtualized, infinite
│   └── <PostCard> (×N)
│       ├── <AuthorInfo />
│       ├── <PostContent />       (text, image, video — render by type)
│       ├── <MediaGallery />
│       └── <PostActions>
│           ├── <LikeButton />    (optimistic)
│           ├── <CommentCount />
│           └── <ShareButton />
│
├── <LoadingIndicator />   (bottom sentinel)
└── <NewPostsBanner />     ("12 new posts — tap to refresh")
```

---

### State Management Approach

```js
// TanStack Query infinite query — built for this exact pattern
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam = null }) =>
    fetchFeed({ cursor: pageParam, limit: 20 }),
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  staleTime: 1000 * 60 * 5, // 5 minutes — don't refetch on every tab switch
});

// Flatten pages into a single array for virtualization
const posts = data?.pages.flatMap(page => page.posts) ?? [];

// Optimistic like — update cache immediately
const likeMutation = useMutation({
  mutationFn: (postId) => likePost(postId),
  onMutate: async (postId) => {
    await queryClient.cancelQueries({ queryKey: ['feed'] });
    const snapshot = queryClient.getQueryData(['feed']);

    queryClient.setQueryData(['feed'], (old) => ({
      ...old,
      pages: old.pages.map(page => ({
        ...page,
        posts: page.posts.map(post =>
          post.id === postId
            ? { ...post, liked: !post.liked, likeCount: post.likeCount + (post.liked ? -1 : 1) }
            : post
        ),
      })),
    }));

    return { snapshot }; // for rollback
  },
  onError: (err, _, ctx) => {
    queryClient.setQueryData(['feed'], ctx.snapshot); // rollback
  },
});
```

---

### API Design

```
GET /api/feed?cursor=<postId>&limit=20

Response:
{
  posts: Post[],
  nextCursor: string | null,   // null = no more posts
  newPostsAvailable: boolean   // hint for "new posts" banner
}

POST /api/posts/:id/like
POST /api/posts/:id/unlike
```

---

### Performance Considerations

**Scroll detection with IntersectionObserver:**
```jsx
function FeedLoader({ onLoadMore, hasNextPage, isLoading }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: '400px' } // trigger 400px before sentinel reaches viewport
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isLoading, onLoadMore]);

  return <div ref={sentinelRef} />;
}
```

**Media loading:**
- Images: `loading="lazy"` + explicit `width`/`height` to prevent layout shift (CLS)
- Videos: `preload="none"` — don't auto-download video until user plays
- Use `IntersectionObserver` to auto-play/pause videos in viewport

**Skeleton loading:**
```jsx
// Show skeletons for next batch while fetching
{isFetchingNextPage && (
  Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
)}
```

---

### Scalability & Edge Cases

- **Duplicate posts:** Cursor-based pagination can still produce duplicates if posts are deleted mid-scroll. Deduplicate by ID on the client: `new Map(posts.map(p => [p.id, p]))`.
- **New posts while scrolling:** Don't prepend to feed (shifts scroll position). Show a "N new posts" banner at top; clicking it refreshes to top.
- **Post deletion:** Subscribe to a WebSocket event or poll for tombstoned IDs; filter them out of the cache.
- **Session restore:** On navigation back, restore scroll position. Store scroll offset in session storage, not URL.

---

## 3. Design a Form Builder

**🔴 HARD**

---

### Requirements Gathering

**Functional:**
- Drag-and-drop field addition (text, number, select, checkbox, date, file)
- Field configuration (label, placeholder, required, validation rules)
- Form preview mode
- Form export as JSON schema
- Form responses collection and display

**Non-functional:**
- Builder must feel real-time (drag lag < 50ms)
- Generated forms must be accessible (ARIA, keyboard)
- Schema must be portable (can render outside the builder)

---

### Component Architecture

```
<FormBuilder>
├── <FieldPalette>                    ← draggable sources
│   └── <FieldTypeCard type="text" />
│
├── <FormCanvas>                      ← drop zone, renders form layout
│   ├── <SortableFieldList>           ← @dnd-kit/sortable
│   │   └── <FormFieldEditor>         ← selected field being configured
│   │       ├── <FieldPreview />
│   │       └── <DragHandle />
│   └── <DropZonePlaceholder />       ← shown when dragging
│
├── <FieldConfigPanel>                ← right sidebar
│   ├── <LabelConfig />
│   ├── <ValidationConfig />
│   └── <OptionsConfig />             ← for select/checkbox
│
└── <FormPreviewModal>
    └── <DynamicForm schema={formSchema} />   ← renderer, reusable

<DynamicForm schema={...}>            ← standalone, shareable renderer
├── <FieldRenderer type="text" />
├── <FieldRenderer type="select" />
└── <SubmitButton />
```

---

### State Management Approach

**Core: a normalized schema as state**

```ts
type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'file';

interface Field {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { label: string; value: string }[]; // for select/checkbox
}

interface FormSchema {
  id: string;
  title: string;
  fields: string[];           // ordered array of field IDs
  fieldMap: Record<string, Field>;  // normalized — O(1) access
}
```

**Zustand store:**
```ts
const useFormBuilderStore = create<FormBuilderStore>((set, get) => ({
  schema: initialSchema,
  selectedFieldId: null,
  isPreviewMode: false,
  history: [],           // undo/redo stack
  future: [],

  addField: (type: FieldType) => {
    const field: Field = { id: uuid(), type, label: '', required: false };
    set(state => ({
      schema: {
        ...state.schema,
        fields: [...state.schema.fields, field.id],
        fieldMap: { ...state.schema.fieldMap, [field.id]: field },
      },
    }));
  },

  updateField: (id, updates) => set(state => ({
    schema: {
      ...state.schema,
      fieldMap: {
        ...state.schema.fieldMap,
        [id]: { ...state.schema.fieldMap[id], ...updates },
      },
    },
  })),

  reorderFields: (fromIndex, toIndex) => set(state => {
    const fields = [...state.schema.fields];
    const [moved] = fields.splice(fromIndex, 1);
    fields.splice(toIndex, 0, moved);
    return { schema: { ...state.schema, fields } };
  }),

  undo: () => { /* pop history, push to future */ },
  redo: () => { /* pop future, push to history */ },
}));
```

---

### API Design

```
POST   /api/forms              — create form, returns { formId }
PUT    /api/forms/:id          — update schema (auto-save on change)
GET    /api/forms/:id          — load form schema
GET    /api/forms/:id/schema   — public endpoint for renderer (no auth)

POST   /api/forms/:id/responses   — submit a form response
GET    /api/forms/:id/responses   — list responses (paginated)
```

**Auto-save with debounce:**
```ts
const debouncedSave = useMemo(
  () => debounce((schema) => saveForm(schema), 1500),
  []
);

// Watch schema, save 1.5s after last change
useEffect(() => {
  debouncedSave(schema);
}, [schema]);
```

---

### Performance Considerations

- **Drag performance:** Use `@dnd-kit/core` over `react-beautiful-dnd` — it uses transforms (compositor thread) not top/left (layout thread). Avoid re-rendering the entire field list during drag — only the dragged item and its neighbors.
- **Large forms:** If a form has 100+ fields, virtualize the canvas list.
- **Undo/redo:** Don't store the full schema in every history entry — store diffs (JSON Patch RFC 6902). A schema diff is typically 1–5 operations vs. a full copy.

**Collaborative editing (stretch goal):**
- Use CRDT (Conflict-free Replicated Data Types) like Yjs for multi-user editing
- Operational Transforms (OT) as alternative — used by Google Docs

---

### Scalability & Edge Cases

- **Schema versioning:** When you update the schema, existing responses may have fields that no longer exist. Store schema version with each response; render responses with the schema version they were submitted under.
- **Conditional logic:** "Show field B only if field A = Yes." Add a `conditions` array to each field. The renderer evaluates conditions against current form values.
- **File fields:** Use presigned S3 URLs (same as chat). Never upload through your form API server.
- **Accessibility of generated forms:** Every field must have a `<label>` with `htmlFor` matching `input id`. Error messages must use `aria-describedby`. Required fields need `aria-required="true"`.

---

## 4. Design an E-Commerce Cart

**🟡 MEDIUM**

---

### Requirements Gathering

**Functional:**
- Add/remove/update quantity of items
- Persistent cart (survives refresh, works across devices when logged in)
- Cart count badge in header
- Price calculation (subtotal, discounts, tax, total)
- Proceed to checkout
- Guest cart → merge with user cart on login

**Non-functional:**
- Cart updates must feel instant (optimistic)
- Cart must sync across tabs
- Stock validation before checkout (not on every add)

---

### Component Architecture

```
<Header>
└── <CartBadge count={itemCount} />       ← derived from cart store

<CartDrawer isOpen={...}>
├── <CartItemList>
│   └── <CartItem>
│       ├── <ProductImage />
│       ├── <ProductInfo />
│       ├── <QuantitySelector />           ← debounced update
│       └── <RemoveButton />
│
├── <CartSummary>
│   ├── <Subtotal />
│   ├── <DiscountCode />
│   ├── <TaxEstimate />
│   └── <Total />
│
└── <CheckoutButton />
```

---

### State Management Approach

```ts
// Zustand + localStorage persistence
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],              // { productId, quantity, price, name, image }

      addItem: (product) => set(state => {
        const existing = state.items.find(i => i.productId === product.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { items: [...state.items, { productId: product.id, quantity: 1, ...product }] };
      }),

      updateQuantity: (productId, quantity) => set(state => ({
        items: quantity === 0
          ? state.items.filter(i => i.productId !== productId)
          : state.items.map(i => i.productId === productId ? { ...i, quantity } : i),
      })),

      removeItem: (productId) => set(state => ({
        items: state.items.filter(i => i.productId !== productId),
      })),

      clearCart: () => set({ items: [] }),

      // Derived
      get itemCount() { return get().items.reduce((sum, i) => sum + i.quantity, 0); },
      get subtotal() { return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0); },
    }),
    {
      name: 'cart-storage',           // localStorage key
      partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
);
```

**Cross-tab sync:**
```js
// Zustand persist uses localStorage — storage events fire across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'cart-storage') {
    useCartStore.persist.rehydrate(); // sync from updated localStorage
  }
});
```

**Guest → authenticated merge:**
```js
async function onLoginSuccess(userId) {
  const localCart = useCartStore.getState().items;

  if (localCart.length > 0) {
    const serverCart = await fetchUserCart(userId);
    const merged = mergeCartItems(localCart, serverCart); // deduplicate, take max quantity
    await saveCartToServer(userId, merged);
    useCartStore.setState({ items: merged });
  } else {
    const serverCart = await fetchUserCart(userId);
    useCartStore.setState({ items: serverCart });
  }
}
```

---

### API Design

```
GET    /api/cart                   — load server-side cart (authenticated users)
PUT    /api/cart                   — sync entire cart (after merge)
POST   /api/cart/items             — add item { productId, quantity }
PATCH  /api/cart/items/:productId  — update quantity
DELETE /api/cart/items/:productId  — remove item

POST   /api/checkout/validate      — validate stock before payment
       Response: { valid: bool, stockIssues: [{ productId, available, requested }] }
```

---

### Performance Considerations

- **Price calculation on server:** Never trust client-side totals for payment. Always recalculate server-side at checkout. Client calculation is for UX only.
- **Quantity debounce:** Don't fire API on every keystroke in quantity field. Debounce 600ms and send optimistic UI immediately.
- **Cart badge rendering:** `itemCount` is derived from cart state — make sure the Header only subscribes to `itemCount`, not the full cart array. In Zustand: `const count = useCartStore(state => state.itemCount)`.
- **Image optimization:** Product images in cart should be small (64×64). Use `srcset` or a CDN resize param.

---

### Scalability & Edge Cases

- **Price changes:** Product prices in cart may differ from current price. On cart open, refetch latest prices and show a warning if any changed.
- **Stock depletion:** Validate stock at checkout initiation, not on add-to-cart (too aggressive). Show clear error if item sells out before purchase completes.
- **Coupon codes:** Apply on server only — never discount on client. Server returns the discounted total; client displays it.
- **Cart abandonment:** Store cart server-side for logged-in users. Email cart abandonment after 1 hour via a background job — not a frontend concern, but mention it shows systems thinking.

---

## 5. Design a Real-Time Notification System

**🔴 HARD**

---

### Requirements Gathering

**Functional:**
- Receive real-time notifications (new message, like, comment, mention)
- Notification bell with unread count badge
- Notification dropdown list (grouped by type, time-relative timestamps)
- Mark as read (single + mark all read)
- Click notification → navigate to relevant content
- Push notifications when tab not active (Web Push)

**Non-functional:**
- Notification appears < 500ms after server event
- Badge count accurate across multiple tabs
- Works offline — notification persists until dismissed

---

### Component Architecture

```
<NotificationBell unreadCount={count}>     ← in Header
└── <NotificationDropdown isOpen={...}>
    ├── <NotificationHeader>
    │   └── <MarkAllReadButton />
    ├── <NotificationList>                  ← virtualized if > 100
    │   └── <NotificationItem>
    │       ├── <NotificationIcon type={...} />
    │       ├── <NotificationText />        (templated: "{user} liked your post")
    │       ├── <TimeAgo timestamp={...} /> (auto-updating)
    │       └── <ReadIndicator />
    └── <ViewAllLink to="/notifications" />
```

---

### State Management Approach

```ts
// Zustand — notifications are critical client state
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  connectionStatus: 'connecting' | 'open' | 'closed';

  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setConnectionStatus: (s: ConnectionStatus) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  connectionStatus: 'connecting',

  addNotification: (notification) => set(state => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),

  markRead: (id) => set(state => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),

  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
}));
```

**Transport: Server-Sent Events (SSE) vs WebSocket**

```
WebSocket:  Full duplex (client ↔ server). Good for chat (bi-directional).
SSE:        Server → client only. Perfect for notifications (one-directional).
            - Native browser support, auto-reconnect built in
            - Works over HTTP/1.1 (no upgrade handshake)
            - Easier to load balance (stateless HTTP)

For notifications: SSE is the better choice.
```

```js
// SSE implementation
function useNotificationStream() {
  const addNotification = useNotificationStore(s => s.addNotification);

  useEffect(() => {
    const source = new EventSource('/api/notifications/stream', {
      withCredentials: true,
    });

    source.addEventListener('notification', (e) => {
      const notification = JSON.parse(e.data);
      addNotification(notification);

      // Also trigger browser notification if tab not focused
      if (document.visibilityState === 'hidden' && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/icon-192.png',
        });
      }
    });

    source.onerror = () => {
      useNotificationStore.getState().setConnectionStatus('closed');
      // EventSource auto-reconnects — no manual retry needed
    };

    return () => source.close();
  }, []);
}
```

---

### API Design

```
GET  /api/notifications?page=1&limit=20   — paginated history
GET  /api/notifications/stream            — SSE stream (long-lived)
POST /api/notifications/:id/read          — mark single read
POST /api/notifications/read-all          — mark all read
DELETE /api/notifications/:id             — dismiss

SSE event types:
  notification    { id, type, title, body, actionUrl, timestamp }
  unread_count    { count }    — sync count on reconnect
```

---

### Performance Considerations

- **Tab sync:** Use `BroadcastChannel` to propagate notification state across tabs.
```js
const channel = new BroadcastChannel('notifications');
// After marking read:
channel.postMessage({ type: 'READ', id: notificationId });
// Other tabs listen:
channel.onmessage = (e) => {
  if (e.data.type === 'READ') markRead(e.data.id);
};
```

- **TimeAgo auto-update:** Use `requestAnimationFrame` or a global interval to update relative timestamps. Don't set per-notification intervals.
- **Notification count in title:** `document.title = `(${count}) App Name`` for unfocused tab awareness.
- **Virtualize long lists:** After 100+ notifications, virtualize the dropdown list.

---

### Scalability & Edge Cases

- **Missed notifications (reconnect gap):** Store `lastEventId` from SSE. On reconnect, send it: `GET /api/notifications/stream?lastEventId=X`. Server replays missed events.
- **Multiple devices:** SSE connection is per-session. Use a message broker (Redis Pub/Sub) on the server to fan out to all of a user's active connections.
- **Notification grouping:** "Alice, Bob, and 5 others liked your post" — aggregate on server. Send a `notification_update` event to replace an existing notification rather than adding a duplicate.
- **Permission flow:** Request `Notification.permission` only after user interaction (browser requirement). Don't ask on page load.

---

## 6. Design a File Upload Component with Progress

**🟡 MEDIUM**

---

### Requirements Gathering

**Functional:**
- Single and multi-file upload
- Drag-and-drop + click-to-select
- File type and size validation (client-side before upload)
- Upload progress per file (percentage bar)
- Pause, resume, and cancel uploads
- Retry on failure

**Non-functional:**
- Large files (up to 5GB) must work
- Progress must update smoothly (60fps)
- Must work on mobile (touch drag-and-drop via input)

---

### Component Architecture

```
<FileUpload onComplete={onComplete}>
├── <DropZone>
│   ├── <FileInput />                 (hidden, triggered by click)
│   └── <DropZoneUI isDragActive={} />
│
└── <FileList>
    └── <FileItem> (per file)
        ├── <FileIcon type={...} />
        ├── <FileName />
        ├── <FileSize />
        ├── <ProgressBar percent={...} />
        ├── <StatusIndicator />        (queued / uploading / done / error)
        └── <ActionButton />           (pause | resume | cancel | retry)
```

---

### State Management Approach

```ts
type FileStatus = 'queued' | 'uploading' | 'paused' | 'complete' | 'error';

interface UploadFile {
  id: string;           // local UUID
  file: File;
  status: FileStatus;
  progress: number;     // 0–100
  error: string | null;
  abortController: AbortController | null;
  url: string | null;   // CDN URL after success
}

const useUploadStore = create<UploadStore>((set, get) => ({
  files: [] as UploadFile[],

  addFiles: (newFiles: File[]) => {
    const validated = newFiles
      .filter(f => f.size <= 5 * 1024 * 1024 * 1024) // 5GB max
      .filter(f => ALLOWED_TYPES.includes(f.type));

    set(state => ({
      files: [
        ...state.files,
        ...validated.map(f => ({
          id: uuid(), file: f, status: 'queued',
          progress: 0, error: null, abortController: null, url: null,
        })),
      ],
    }));
  },

  updateProgress: (id, progress) => set(state => ({
    files: state.files.map(f => f.id === id ? { ...f, progress } : f),
  })),

  setStatus: (id, status, extra = {}) => set(state => ({
    files: state.files.map(f => f.id === id ? { ...f, status, ...extra } : f),
  })),

  cancelUpload: (id) => {
    const file = get().files.find(f => f.id === id);
    file?.abortController?.abort();
    set(state => ({
      files: state.files.filter(f => f.id !== id),
    }));
  },
}));
```

---

### API Design

**For files > 100MB: multipart upload to S3**

```
Step 1: POST /api/upload/initiate
  Body: { filename, contentType, size }
  Response: { uploadId, presignedUrls: [{ partNumber, url }] }

Step 2: PUT <presignedUrl>          (direct to S3, per part)
  — Track progress per part via XMLHttpRequest onprogress

Step 3: POST /api/upload/complete
  Body: { uploadId, parts: [{ partNumber, etag }] }
  Response: { url }   (final CDN URL)

Step 4: POST /api/upload/abort (on cancel)
  Body: { uploadId }  — cleans up S3 partial upload
```

**For files < 10MB: simple presigned URL**
```
POST /api/upload/presign  → { url, fields }
PUT  <url>               (direct browser → S3)
```

---

### Performance Considerations

**Progress via XMLHttpRequest (not fetch):**
```js
async function uploadWithProgress(url, file, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => resolve(xhr);
    xhr.onerror = () => reject(new Error('Upload failed'));

    signal.addEventListener('abort', () => {
      xhr.abort();
      reject(new DOMException('Aborted', 'AbortError'));
    });

    xhr.open('PUT', url);
    xhr.send(file);
  });
}
```

**Concurrent upload limit:**
```js
// Upload max 3 files simultaneously
async function uploadQueue(files, maxConcurrent = 3) {
  const chunks = [];
  for (let i = 0; i < files.length; i += maxConcurrent) {
    chunks.push(files.slice(i, i + maxConcurrent));
  }
  for (const chunk of chunks) {
    await Promise.all(chunk.map(uploadFile));
  }
}
```

---

### Scalability & Edge Cases

- **Resumable uploads:** Store the S3 `uploadId` in localStorage. If page refreshes mid-upload, resume from the last completed part.
- **File validation:** Validate MIME type on client AND server. Client validation is UX; server validation is security. Never trust `file.type` from the browser.
- **Drag-and-drop on mobile:** Use `<input type="file" multiple>` as primary — it opens native file picker on mobile. Drag-and-drop is desktop enhancement.
- **Chunk size:** S3 minimum part size is 5MB. Use 10MB chunks for reliability vs. 5MB for faster pause/resume.

---

## 7. Design a Search Autocomplete

**🟡 MEDIUM**

---

### Requirements Gathering

**Functional:**
- Suggestions appear as user types (after 2+ characters)
- Keyboard navigation (↑↓ select, Enter confirm, Escape close)
- Recent searches shown before first keystroke
- Highlighted matching text in results
- Support for different result types (products, users, articles)

**Non-functional:**
- Results visible within 200ms of keystroke (debounced)
- Accessible (ARIA combobox pattern)
- Works correctly on mobile (no virtual keyboard issues)

---

### Component Architecture

```
<SearchAutocomplete>
├── <SearchInput>                 (role="combobox", aria-expanded, aria-controls)
│   ├── <SearchIcon />
│   ├── <input role="searchbox" aria-autocomplete="list" />
│   └── <ClearButton />
│
└── <SuggestionDropdown>          (role="listbox", aria-label)
    ├── <SuggestionGroup label="Recent">
    │   └── <SuggestionItem role="option" />
    ├── <SuggestionGroup label="Products">
    │   └── <SuggestionItem role="option">
    │       ├── <HighlightedText match={...} />
    │       └── <ResultMeta />
    └── <ViewAllResults link="/search?q=..." />
```

---

### State Management Approach

```ts
function useSearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Debounced fetch
  const debouncedQuery = useDebounce(query, 200);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => fetchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60, // suggestions valid for 1 minute
    keepPreviousData: true, // don't flash empty while fetching
  });

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useLocalStorage('recent-searches', []);

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = suggestions?.results ?? [];
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, -1));
        break;
      case 'Enter':
        if (activeIndex >= 0) selectSuggestion(items[activeIndex]);
        else submitSearch(query);
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return { query, setQuery, suggestions, isLoading, isOpen, activeIndex, handleKeyDown };
}
```

---

### API Design

```
GET /api/search/suggest?q=reac&limit=8&types=products,users,articles

Response:
{
  results: [
    { id, type: 'product', title: 'React Course', subtitle: '$49', url: '/products/123', score: 0.98 },
    { id, type: 'user',    title: 'Dan Abramov',  subtitle: '@dan_abramov',  url: '/users/dan', score: 0.87 },
  ],
  totalCount: 142
}
```

---

### Performance Considerations

**Debounce + cache = minimal requests:**
```js
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
// 200ms debounce + TanStack Query cache = same query never fires twice
```

**Text highlighting:**
```jsx
function HighlightedText({ text, query }) {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i}>{part}</mark>    // highlighted match
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}
```

---

### Scalability & Edge Cases

- **Click-outside to close:** Use `useEffect` with `mousedown` event on `document`, check if click target is inside component ref.
- **Request cancellation:** Cancel in-flight suggestion requests when a new keystroke arrives. Use `AbortController` passed to fetch.
- **Special characters:** Escape user input before using in regex (`escapeRegex` above) to prevent ReDoS attacks.
- **Empty state:** Show "No results for 'X'" — never show a blank dropdown.
- **Search submit vs suggestion select:** Pressing Enter with no active index should go to full search results page. Selecting a suggestion goes to that specific item.

---

## 8. Design a Dashboard with Widgets

**🔴 HARD**

---

### Requirements Gathering

**Functional:**
- Configurable widget grid (drag to rearrange, resize)
- Widget types: chart, metric card, table, map, text
- Per-user layout persistence
- Widget data refresh intervals (some real-time, some hourly)
- Add/remove widgets from a catalog
- Export dashboard as PDF/image

**Non-functional:**
- Dashboard loads < 2s with 20 widgets
- Each widget fails gracefully (doesn't break others)
- Mobile: stack vertically, no drag on touch (or simplified)

---

### Component Architecture

```
<DashboardPage>
├── <DashboardHeader>
│   ├── <DashboardTitle />
│   ├── <EditModeToggle />
│   └── <ExportButton />
│
├── <WidgetGrid layout={layout} isEditing={isEditing}>
│   └── <GridItem key={id} x y w h>        ← react-grid-layout
│       └── <Widget>
│           ├── <WidgetHeader title resizeHandle dragHandle />
│           ├── <ErrorBoundary fallback={<WidgetError />}>
│           │   └── <WidgetContent type={...} config={...} />
│           │       (ChartWidget | MetricWidget | TableWidget | ...)
│           └── <WidgetLoadingSkeleton isLoading={...} />
│
└── <WidgetCatalog isOpen={...}>            ← slide-in panel
    └── <WidgetCatalogItem onAdd={...} />
```

---

### State Management Approach

```ts
// Layout state (persisted to server)
interface LayoutItem { id: string; x: number; y: number; w: number; h: number; }

// Widget config (what data to show)
interface WidgetConfig {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  title: string;
  dataSource: string;   // API endpoint or query key
  refreshInterval: number; // ms, 0 = no auto-refresh
  config: Record<string, unknown>; // type-specific config
}

// Store
const useDashboardStore = create(persist((set) => ({
  layout: [] as LayoutItem[],
  widgets: {} as Record<string, WidgetConfig>,
  isEditing: false,

  updateLayout: (newLayout) => set({ layout: newLayout }),
  addWidget: (widget) => set(state => ({
    widgets: { ...state.widgets, [widget.id]: widget },
    layout: [...state.layout, { id: widget.id, x: 0, y: Infinity, w: 4, h: 3 }],
  })),
  removeWidget: (id) => set(state => {
    const { [id]: _, ...rest } = state.widgets;
    return { widgets: rest, layout: state.layout.filter(l => l.id !== id) };
  }),
}), { name: 'dashboard-layout' }));

// Per-widget data fetching — each widget manages its own data
function useWidgetData(widgetId: string) {
  const config = useDashboardStore(s => s.widgets[widgetId]);

  return useQuery({
    queryKey: ['widget', widgetId, config.dataSource],
    queryFn: () => fetchWidgetData(config.dataSource, config.config),
    refetchInterval: config.refreshInterval || false,
    staleTime: config.refreshInterval ? config.refreshInterval / 2 : Infinity,
  });
}
```

---

### API Design

```
GET  /api/dashboards/:id          — load layout + widget configs
PUT  /api/dashboards/:id/layout   — save layout after drag/resize

GET  /api/widgets/catalog         — available widget types
GET  /api/widgets/:id/data        — per-widget data fetch
     Query params: config-specific (timeRange, metrics, filters)

POST /api/dashboards/:id/export   — trigger server-side PDF render
     Response: { jobId }          — poll for completion
GET  /api/export/:jobId           — download when ready
```

---

### Performance Considerations

- **Independent widget loading:** Each widget fetches its own data independently. The dashboard shell renders in < 100ms; widgets fill in as data arrives.
- **Error isolation:** Wrap each widget in `<ErrorBoundary>`. One failing widget must not crash the dashboard.
- **Lazy load widget types:** `React.lazy` per widget type. Only load ChartWidget code when a chart widget is on the dashboard.
- **Canvas export:** Use `html2canvas` for client-side screenshot or puppeteer on a headless server for reliable PDF. Client-side is simpler but handles CSS poorly; server-side is better quality.
- **Layout save debounce:** Debounce layout persistence 1000ms after drag stops — don't save on every pixel of drag.

---

### Scalability & Edge Cases

- **100+ widgets:** Virtualize the grid — only render widgets in or near the viewport. `react-grid-layout` doesn't do this by default; you'd need a custom virtualized grid.
- **Real-time widgets:** Use WebSocket or SSE for widgets with < 5s refresh. For > 5s, `refetchInterval` polling is simpler.
- **Shared dashboards:** Add a viewer/editor permission model. Viewers see the layout but can't edit. Changes by editors should propagate via WebSocket.
- **Mobile fallback:** On screens < 768px, stack all widgets vertically in a predefined order; disable drag-and-drop entirely.

---

## 9. State Management Architecture for a Large App

**🔴 HARD**

---

### Requirements Gathering

The scenario: a SaaS app with 50+ routes, teams of 5–10 frontend engineers, complex data dependencies, real-time updates, and strict performance requirements.

---

### The Three-Layer Model

```
┌─────────────────────────────────────────────┐
│           SERVER STATE                       │
│   TanStack Query / RTK Query                 │
│   Remote data, cache, sync, background refetch │
│   Everything that lives on a server          │
└──────────────────┬──────────────────────────┘
                   │ fetched via hooks
┌──────────────────▼──────────────────────────┐
│           SHARED CLIENT STATE               │
│   Zustand / Redux Toolkit                    │
│   UI state shared across routes             │
│   Auth user, theme, notifications, cart      │
└──────────────────┬──────────────────────────┘
                   │ scoped per component tree
┌──────────────────▼──────────────────────────┐
│           LOCAL COMPONENT STATE             │
│   useState / useReducer                      │
│   Modal open/closed, form dirty state        │
│   Input values, accordion expanded           │
└─────────────────────────────────────────────┘
```

---

### Architecture Details

**Server state — TanStack Query:**
```ts
// Centralized query key factory — prevents string typos
export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (filters: UserFilters) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    posts: (id: string) => ['users', id, 'posts'] as const,
  },
  posts: {
    all: ['posts'] as const,
    detail: (id: string) => ['posts', id] as const,
  },
};

// Usage — invalidate all user queries on update
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

// Or just the specific user's data
queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
```

**Shared client state — Zustand slices:**
```ts
// Modular stores — each slice is a separate store
// Prevents monolithic store with unrelated state

const useAuthStore = create<AuthStore>()(...)  // auth.store.ts
const useCartStore = create<CartStore>()(...)  // cart.store.ts
const useUIStore = create<UIStore>()(...)      // ui.store.ts (modals, sidebar)
const useNotificationStore = create<...>()(...)

// Each store can be composed:
function useIsCartEmpty() {
  return useCartStore(s => s.items.length === 0);
}
```

**URL as state — for shareable filters:**
```ts
// Don't put filters in Zustand if they should be shareable via URL
// Use useSearchParams (React Router) instead
function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    category: searchParams.get('category') ?? 'all',
    sort: searchParams.get('sort') ?? 'newest',
    page: Number(searchParams.get('page')) || 1,
  };

  const { data } = useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => fetchProducts(filters),
  });
}
// Sharing the URL shares the exact filter state — no extra code
```

---

### Decision Matrix

| State type | Tool | Reasoning |
|---|---|---|
| Remote data from API | TanStack Query | Caching, background sync, dedup |
| Auth user | Zustand (persisted) | Shared everywhere, survives navigation |
| Shopping cart | Zustand (persisted) | Shared, needs localStorage |
| Notifications | Zustand | Real-time updates via WS |
| Filter/sort/pagination | URL params | Shareable, bookmarkable |
| Modal open/closed | useState (local) | Local, ephemeral |
| Form field values | RHF (local) | Local, controlled by form lib |
| Theme | Zustand (persisted) | Shared, survives refresh |
| Feature flags | TanStack Query | Remote config, cache 24h |

---

### Performance Considerations

```ts
// Selector memoization — don't subscribe to more than you need
// Bad — rerenders on any cart change
const { items, subtotal, tax } = useCartStore();

// Good — selective subscription
const itemCount = useCartStore(s => s.items.length);
const subtotal = useCartStore(s => s.subtotal); // derived selector

// TanStack Query — specify staleTime to prevent over-fetching
const { data } = useQuery({
  queryKey: ['feature-flags'],
  queryFn: fetchFeatureFlags,
  staleTime: 1000 * 60 * 60 * 24, // 24 hours — rarely changes
});
```

---

### Scalability & Edge Cases

- **State devtools:** Zustand DevTools + TanStack Query DevTools are non-negotiable in development. They make debugging state transitions visible.
- **Hydration:** For SSR (Next.js), use TanStack Query's `dehydrate/hydrate` pattern to pre-fill the client cache with server-fetched data.
- **Real-time sync:** WebSocket events should update the TanStack Query cache directly via `queryClient.setQueryData`, not just a Zustand store — this way components using `useQuery` see the update automatically.
- **Testing:** Test Zustand stores in isolation (pure functions). Test components against real server state using MSW to intercept API calls.

---

## 10. Caching Strategies for Frontend Apps

**🔴 HARD**

---

### The Caching Layers

```
Browser Request
      ↓
1. Memory Cache      (same-session, same-origin, instaburst)
      ↓ miss
2. Service Worker    (offline first, custom strategy)
      ↓ miss
3. HTTP Cache        (Cache-Control, ETags, CDN)
      ↓ miss
4. CDN Edge Cache    (Cloudflare, Fastly, Vercel Edge)
      ↓ miss
5. Origin Server     (actual API / database)
```

---

### Layer 1: TanStack Query (In-Memory, Application Cache)

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // data is fresh for 5 min
      gcTime: 1000 * 60 * 30,          // keep in memory for 30 min
      refetchOnWindowFocus: true,       // refetch when tab regains focus
      refetchOnReconnect: true,         // refetch when connection restored
      retry: 2,                         // retry failed queries twice
    },
  },
});

// staleTime = 0          → always refetch (real-time data: stock prices, live chat)
// staleTime = 5min       → mostly-fresh data (user profiles, product details)
// staleTime = 60min      → slowly changing data (categories, settings)
// staleTime = Infinity   → static data (countries list, color palette)
```

---

### Layer 2: HTTP Cache Headers

```
Cache-Control: no-store
  → Never cache (user-specific sensitive data, auth endpoints)

Cache-Control: no-cache
  → Cache but always revalidate with server (sends If-None-Match)
  → Server returns 304 Not Modified if unchanged — saves bandwidth

Cache-Control: max-age=3600
  → Cache for 1 hour — no server request during this period
  → Good for: product pages, blog posts

Cache-Control: max-age=31536000, immutable
  → Cache for 1 year — NEVER expires
  → Perfect for: hashed static assets (app.abc123.js, styles.def456.css)
  → Content hash in filename = safe to cache forever

ETag + If-None-Match:
  → Server sends ETag: "abc123" (hash of response)
  → Client sends If-None-Match: "abc123" on next request
  → Server returns 304 if unchanged, 200 with new content if changed
  → Saves bandwidth even when cache expired
```

---

### Layer 3: Service Worker Cache Strategies

```js
// Strategy selection per route type:

// 1. Cache First (static assets — images, fonts)
// Fast. Stale. Good for immutable resources.
async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? fetch(request);
}

// 2. Network First (API data — fresh but with offline fallback)
// Fresh when online. Graceful offline.
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open('api-cache');
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request); // offline fallback
  }
}

// 3. Stale While Revalidate (non-critical UI assets — avatars, thumbnails)
// Fast (uses cache) AND fresh (updates in background).
async function staleWhileRevalidate(request) {
  const cache = await caches.open('sw-cache');
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then(r => {
    cache.put(request, r.clone()); // update cache silently
    return r;
  });
  return cached ?? networkPromise; // return cache immediately if available
}

// 4. Network Only (auth, payments — never cache)
async function networkOnly(request) {
  return fetch(request);
}
```

**Route-based strategy mapping:**
```js
// In service worker install:
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/auth')) {
    event.respondWith(networkOnly(event.request));

  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));

  } else if (/\.(js|css|woff2)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(event.request));   // hashed filenames = safe

  } else if (/\.(png|jpg|webp|svg)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
```

---

### Layer 4: CDN and Edge Caching

```
Static files (JS/CSS/images):
  Cache-Control: public, max-age=31536000, immutable
  Served from CDN edge nodes — no origin hit

HTML pages:
  Cache-Control: public, max-age=0, must-revalidate
  Or: s-maxage=86400, stale-while-revalidate=3600
  s-maxage = CDN cache duration (different from browser)
  stale-while-revalidate = serve stale while fetching fresh in background

API responses:
  Cache-Control: private, max-age=60
  private = CDN won't cache (user-specific data)
  max-age=60 = browser caches 60 seconds
```

**Cache invalidation:**
```
CDN purge on deploy — Cloudflare API or Vercel deploy hook
Filename hashing — content hash in filename makes stale caches impossible
Surrogate-Key header — tag CDN cached resources, purge by tag
```

---

### Application-Level Caching Patterns

```ts
// Optimistic updates — perceived instant response
function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const prev = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], optimisticallyLike(prev, postId));
      return { prev };                    // snapshot for rollback
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(['posts'], ctx.prev); // rollback
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // sync server truth
    },
  });
}

// Prefetching — cache before user navigates
function ProductCard({ product }) {
  const queryClient = useQueryClient();

  return (
    <Link
      to={`/products/${product.id}`}
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ['product', product.id],
          queryFn: () => fetchProduct(product.id),
          staleTime: 1000 * 60 * 5,
        });
      }}
    >
      {product.name}
    </Link>
  );
}
// By the time user clicks, data is already in cache
```

---

### Cache Invalidation Decision Tree

```
When does this data change?
  └── On user action (I liked a post)
       → Optimistic update + invalidate after mutation
  └── On someone else's action (someone else liked a post)
       → WebSocket event → queryClient.setQueryData
  └── On a schedule (daily deals)
       → staleTime matches the schedule (staleTime: 24h)
  └── Never (country list, color palette)
       → staleTime: Infinity
  └── Always (stock prices, live scores)
       → staleTime: 0 + refetchInterval: 5000

Common cache mistake: invalidating too broadly
  queryClient.invalidateQueries() → refetches EVERYTHING
  queryClient.invalidateQueries({ queryKey: ['users'] }) → only user queries
  queryClient.invalidateQueries({ queryKey: ['users', 'detail', id] }) → one user
  → Be as specific as possible
```

---

*End of Frontend System Design Guide — 10 Questions*
