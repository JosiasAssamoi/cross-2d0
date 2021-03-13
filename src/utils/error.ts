export default function error(err) {
    return err instanceof Error ? { err: err.message } : { err: String(err) }
}