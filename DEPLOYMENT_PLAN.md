# Lokah App - Database Schema Fix Deployment Plan

## Overview
This deployment plan addresses the onboarding flow failure caused by missing database fields. The comprehensive schema migration adds all 42+ fields collected by the Onboarding.tsx component.

## Files Modified/Created

### Database Migrations
- ✅ `supabase/migrations/20251102120000_comprehensive_onboarding_schema.sql` - **MAIN MIGRATION**
- ✅ `supabase/migrations/20251102120100_rollback_comprehensive_onboarding.sql` - **ROLLBACK MIGRATION**

### Frontend Updates
- ✅ `src/integrations/supabase/types.ts` - Updated TypeScript types for new schema
- ✅ `src/pages/Onboarding.tsx` - Updated to save all collected data to database

### Testing
- ✅ `supabase/tests/schema_validation.test.sql` - Schema validation tests

## Deployment Steps

### Phase 1: Pre-Deployment Validation (Dev/Staging)

1. **Backup Current Database**
   ```bash
   supabase db dump --project-ref your-project-ref > prod_backup_$(date +%Y%m%d).sql
   ```

2. **Apply Migration to Staging**
   ```bash
   supabase db push --include-all
   ```

3. **Run Schema Validation Tests**
   ```bash
   psql "staging-connection-string" -f supabase/tests/schema_validation.test.sql
   ```

4. **Test Onboarding Flow**
   - Create test account in staging
   - Complete full 7-step onboarding process
   - Verify all data saves correctly
   - Check personality quiz completion works

### Phase 2: Production Deployment

1. **Schedule Maintenance Window**
   - Time: Low-traffic period (e.g., 2-4 AM local time)
   - Duration: 30 minutes
   - Notify users via in-app banner 24h in advance

2. **Deploy Migration**
   ```bash
   supabase db push --include-all
   ```

3. **Verify Deployment**
   - Check Supabase dashboard for migration status
   - Run schema validation tests on production
   - Monitor error logs for 30 minutes

4. **Enable Traffic**
   - Remove maintenance banner
   - Monitor onboarding completion rates

## Rollback Plan

If issues arise:
1. Run rollback migration: `supabase db push --include-all`
2. Revert frontend changes if needed: `git revert <commit-hash>`
3. Full restore from backup if required

## Success Criteria

✅ **Onboarding Flow Works**: New users can complete full 7-step process without errors
✅ **Data Persistence**: All collected data saves correctly to database
✅ **Type Safety**: No TypeScript errors related to schema changes
✅ **Performance**: No degradation in query performance

---

**Last Updated**: 2025-11-02
